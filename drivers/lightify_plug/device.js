'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class LightifyPlugZigBee extends ZigBeeDevice {
	onMeshInit() {

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			getOpts: {
				pollInterval: 15000,
			},
		});
	}
}

module.exports = LightifyPlugZigBee;