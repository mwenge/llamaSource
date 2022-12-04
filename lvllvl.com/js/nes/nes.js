var nes_ready = false;

var options = {};
var nes = NES(options);


var nes_init = nes.cwrap('nes_init');
var nes_reset = nes.cwrap('nes_reset');
var nes_insertCartridge = nes.cwrap('nes_insertCartridge', null, ['array','number']);
var nes_getPixelBuffer = nes.cwrap('nes_getPixelBuffer', 'number');


var nes_update = nes.cwrap('nes_update','number', ['number']);
var nes_pause = nes.cwrap('nes_pause');
var nes_play = nes.cwrap('nes_play');
var nes_step = nes.cwrap('nes_step');
var nes_isRunning = nes.cwrap('nes_isRunning','number');


nes['onRuntimeInitialized'] = function() { 
  nes_ready = true;
  nes_init();

  if(typeof onNESReady != 'undefined') {
    onNESReady();
  }

}
