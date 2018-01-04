let dht11_pin: number = 0;

function signal_dht11(pin : number) : void {
    pins.digitalWritePin(pin, 0)
    basic.pause(18)
    let i = pins.digitalReadPin(pin)
}

function wait_for_level(pin: number, level : number) : void {
    while (pins.digitalReadPin(pin) != level);
}

function wait_for_low(pin: number) {
    wait_for_level(pin, 0)
}

function wait_for_high(pin: number) {
    wait_for_level(pin, 1)
}

interface dht11_measurement {
    temperature: number;
    humidity: number;    
}

export function dht11_set_pin(pin: number) {
    dht11_pin = pin;
}

function measure(pin: number): dht11_measurement {
    signal_dht11(pin);
    
    wait_for_low(pin);
    wait_for_high(pin);
    wait_for_low(pin);

    let value = 0;
    let counter = 0;
    
    for (let index2 = 0; index2 <= 32 - 1; index2++) {
        wait_for_high(pin);
        counter = 0
        while (pins.digitalReadPin(pin) == 1) {
            counter += 1;
        }
        if (counter > 4) {
            value = value + (1 << (31 - index2));
        }
    }
    let humidity : number = (value >> 24);
    let temperature : number = (value & 0x0000ff00) >> 8;
    return { temperature, humidity };
}

export function get_temp(): number {
    let measurement = measure(dht11_pin);
    return measurement.temperature;
}

export function get_humidity(): number {
    let measurement = measure(dht11_pin);
    return measurement.humidity;
}