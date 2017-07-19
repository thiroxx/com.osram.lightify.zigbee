'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

const maxBrightness = 255;
const colorTempMin = 154;
const colorTempMax = 370;

class LightifyWhiteZigBee extends ZigBeeDevice {
	onMeshInit() {

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			set: value => value ? 'on' : 'off',
			setParser: () => ({}),
			get: 'onOff',
			reportParser: value => value === 1,
		});

		// Register dim capability
		this.registerCapability('dim', 'genLevelCtrl', {
			set: 'moveToLevel',
			setParser: (value) => {
				if (value === 0) {
					// Turn off
					return this.triggerCapabilityListener('onoff', false)
						.then(() => null)
						.catch(err => new Error('failed_to_trigger_onoff'));
				} else if (this.getCapabilityValue('onoff') === false && value > 0) {

					// Turn on
					return this.triggerCapabilityListener('onoff', true)
						.then(() => ({
							level: value * maxBrightness,
							transtime: this.getSetting('transition_time') * 10
						}))
						.catch(err => new Error('failed_to_trigger_onoff'));
				}
				return {
					level: value * maxBrightness,
					transtime: this.getSetting('transition_time') * 10
				}
			},
			get: 'currentLevel',
			reportParser: value => value / maxBrightness,
		});

		// Register light_temperature capability
		this.registerCapability('light_temperature', 'lightingColorCtrl', {
			set: 'moveToColorTemp',
			setParser: value => ({
				colortemp: map(0, 1, colorTempMin, colorTempMax, value),
				transtime: this.getSetting('transition_time') * 10,
			}),
			get: 'colorTemperature',
			reportParser: value => map(colorTempMin, colorTempMax, 0, 1, value)
		});
	}
}


/**
 * Map a range of values to a different range of values
 * @param inputStart
 * @param inputEnd
 * @param outputStart
 * @param outputEnd
 * @param input
 * @returns {*}
 */
function map(inputStart, inputEnd, outputStart, outputEnd, input) {
	return outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart);
}

module.exports = LightifyWhiteZigBee;

