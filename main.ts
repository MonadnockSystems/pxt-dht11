//% color=#f44242
namespace dht11 {
    let pin = DigitalPin.P0;
    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
    }
    
    function wait_for_level(pin: DigitalPin, level: number): void {
        while (pins.digitalReadPin(pin) != level);
    }
    
    function wait_for_low(pin: DigitalPin) {
        wait_for_level(pin, 0)
    }
    
    function wait_for_high(pin: DigitalPin) {
        wait_for_level(pin, 1)
    }
    
    interface dht11_measurement {
        temperature: number;
        humidity: number;
    }
        
    /**
     * Set pin at which the DHT data line is connected
     * @param pin pin at which the DHT data line is connected
     */
    //% block = "set pin to %pin_arg=DigitalPin"
    //% blockId = "dht11_set_pin"
    export function set_pin(pin_arg: DigitalPin): void {
        pin = pin_arg;
    }
        
    function _measure(): dht11_measurement {
        signal_dht11(this.pin);
        wait_for_low(this.pin);
        wait_for_high(this.pin);
        wait_for_low(this.pin);
        
        let value = 0;
        let counter = 0;
            
        for (let i = 0; i <= 32 - 1; i++) {
            wait_for_high(this.pin);
            counter = 0
            while (pins.digitalReadPin(this.pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        let humidity: number = (value >> 24);
        let temperature: number = (value & 0x0000ff00) >> 8;
        return { temperature, humidity };
    }

    //% block = "temperature"
    //% blockId = "dht11_get_temperature"
    export function temperature(): number {
        let measurement = this._measure();
        return measurement.temperature;
    }

    //% block = "humidity"
    //% blockId = "dht11_get_humidity"
    export function humidity(): number {
        let measurement = this._measure();
        return measurement.humidity;
    }
}