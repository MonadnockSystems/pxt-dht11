//% color=#f44242
namespace dht11 {
    let pin = DigitalPin.P0;
    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
    }
    
    function wait_for_level(level: number): void {
        while (pins.digitalReadPin(pin) != level);
    }
    
    function wait_for_low() {
        wait_for_level(0)
    }
    
    function wait_for_high() {
        wait_for_level(1)
    }

    function pin_is_high(): Boolean {
        return pins.digitalReadPin(pin) == 1;
    }
        
    /**
     * Set pin at which the DHT data line is connected
     * @param pin_arg pin at which the DHT data line is connected
     */
    //% block = "DHT11 is on pin %pin_arg=DigitalPin"
    export function set_pin(pin_arg: DigitalPin): void {
        pin = pin_arg;
    }
    
    //% block
    export function temperature(): number {
        signal_dht11(pin);
        wait_for_low();
        wait_for_high();
        wait_for_low();
        
        let value = 0;
        let counter = 0;
            
        for (let i = 0; i <= 32 - 1; i++) {
            wait_for_high();
            counter = 0
            while (pin_is_high()) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        let temperature: number = (value & 0x0000ff00) >> 8;
        return temperature;
    }

    //% block
    export function humidity(): number {
        signal_dht11(pin);
        wait_for_low();
        wait_for_high();
        wait_for_low();
        
        let value = 0;
        let counter = 0;
            
        for (let i = 0; i <= 32 - 1; i++) {
            wait_for_high();
            counter = 0
            while (pin_is_high()) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        let humidity: number = (value >> 24);
        return humidity;
    }
}