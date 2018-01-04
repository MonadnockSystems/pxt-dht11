//% color=#f44242 icon="\u26C8"
namespace dht11 {
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
    
    export class dht11 {
        pin = DigitalPin.P0;
        
        //% weight=10
        set_pin(pin: DigitalPin) {
            this.pin = pin;
        }
        
        _measure(): dht11_measurement {
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
        
        temperature(): number {
            let measurement = this._measure();
            return measurement.temperature;
        }
        
        humidity(): number {
            let measurement = this._measure();
            return measurement.humidity;
        }
    }
}