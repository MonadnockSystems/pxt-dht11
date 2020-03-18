//% color=#f44242 icon="\uf197" block="Let's Talk Science"
namespace dht11 {
    let pin = DigitalPin.P0;
    let DTH11value = 0;
    function signal_dht11(pin: DigitalPin): void {
        pins.digitalWritePin(pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(pin)
        pins.setPull(pin, PinPullMode.PullUp);

    }

    /**
     * Set pin at which the DHT data line is connected
     * @param pin_arg pin at which the DHT data line is connected
     */
    //% block="DHT11 set pin %pinarg"
    //% blockId=dht11_set_pin
    export function set_pin(pin_arg: DigitalPin): void {
        pin = pin_arg;
    }

    function dht11_read(): number {
        signal_dht11(pin);

        // Wait for response header to finish
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        let value = 0;
        let counter = 0;

        for (let i = 0; i <= 32 - 1; i++) {
            while (pins.digitalReadPin(pin) == 0);
            counter = 0
            while (pins.digitalReadPin(pin) == 1) {
                counter += 1;
            }
            if (counter > 4) {
                value = value + (1 << (31 - i));
            }
        }
        return value;
    }

    /**
     * Executes reading from sensor - both Temperature & Humidity
     * to retrieve static values -> get temperature() or humidity() 
     */
    //% block="DHT11 ReadFromSensor"
    //% blockId=dht11_read_from_sensor
    export function ReadFromSensor() {
        DTH11value=dht11_read();
    }

    /**
     * Returns previously read temperature()
     * Do not forget to call ReadFromSensor() to get current ones 
     */
    //% block
    export function temperature(): number {
        return (DTH11value & 0x0000ff00) >> 8;
    }

    /**
     * Returns previously read humidity()
     * Do not forget to call ReadFromSensor() to get current ones 
     */
    //% block
    export function humidity(): number {
        return DTH11value >> 24
    }
}