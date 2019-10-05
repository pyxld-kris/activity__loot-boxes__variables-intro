import DevLaunchers from "./classes/dev-launchers";

// Load specific game stuff here that will be used in
// this file, or in 'modify.mjs'

export function setupActivity(scene) {
  // Monitor this activity's success conditions
  new DevLaunchers.Activities.ProgressMonitor(scene, function() {});

  scene.activityText = new DevLaunchers.Activities.Info.Text(
    scene,
    Math.floor(scene.game.config.width / 2),
    Math.floor(scene.game.config.height - 25),
    "Set the variable:\n'chestContents'"
  );
  loadModifyCode(scene, () => {
    if (scene.chestContents == "NOTHING") {
      new DevLaunchers.Activities.Info.InstructionSequence(scene, [
        new DevLaunchers.Activities.Info.Instruction(
          scene,
          "Put something in\nthe chest!",
          2000
        )
      ]);
    } else {
      scene.activityText.setText("Click to open\nyour chest");
    }

    scene.chest.on("pointerdown", () => {
      scene.activityText.setText("");
      new DevLaunchers.Activities.Info.Text(
        scene,
        Math.floor(scene.game.config.width / 2),
        Math.floor(scene.game.config.height - 30),
        "You received:\n" + scene.chestContents
      );
      if (scene.chestContents != "NOTHING") {
        new DevLaunchers.Activities.Info.Text(
          scene,
          Math.floor(scene.game.config.width / 2),
          Math.floor(scene.game.config.height / 6),
          "CONGRATULATIONS!"
        );
        new DevLaunchers.Activities.Success.Noise(scene);
      }
    });
  });
}

/***************************/
/* HELPER FUNCTIONS FOLLOW */
/***************************/

/*
 * evalWithinContext()
 * Allows a string of javascript code to be executed within the given scope/context
 * Used after fetching student code in order to run it within the current Phaser scene
 *     (Keeps student coding interface clean)
 */
var evalWithinContext = function(context, code) {
  (function(code) {
    eval(code);
  }.apply(context, [code]));
};

/*
 * loadModifyCode()
 * Loads the 'modify.mjs' file students will be making changes in, and executes it in the
 * current module's scope. We're using this method instead of import to maintain scene scope
 * and keep import/export out of the modify.js script. This makes it more simple for the
 * students to work with.
 */
// Let's load the modify.js script and run it in this scope!
// using this method instead of import to maintain scene scope and keep import/export
//    out of the modify.js script. More simple for students to work with
function loadModifyCode(scene, callback) {
  loadScriptWithinContext("../modify.mjs", scene, callback);
}
function loadScriptWithinContext(path, context, callback) {
  /* eslint-disable */
  let codeText = fetch(path)
    .then(function(response) {
      return response.text();
    })
    .then(function(textString) {
      let modifiedActivityCode = injectIntoModifiedActivityCode(textString);
      evalWithinContext(context, modifiedActivityCode);
      callback();
    });
  /* eslint-enable */
}

function injectIntoModifiedActivityCode(modifiedActivityCode) {
  return modifiedActivityCode;
}
