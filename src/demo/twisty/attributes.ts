import { Vector3 } from "three";
import { parseAlg } from "../../cubing/alg";
import { useNewFaceNames } from "../../cubing/puzzle-geometry";
import {
  experimentalSetShareAllNewRenderers,
  TwistyPlayer,
} from "../../cubing/twisty";

useNewFaceNames(true);
experimentalSetShareAllNewRenderers(true);

{
  document.querySelector("#no-attributes")!.appendChild(new TwistyPlayer());
}

{
  document.querySelector("#alg")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#alg")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
}

{
  document.querySelector("#experimental-start-setup")!.appendChild(
    new TwistyPlayer({
      experimentalStartSetup: parseAlg("(R U R' U R U2' R')'"),
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#experimental-start-setup")!.appendChild(tw);
  tw.experimentalStartSetup = parseAlg("(R U R' U R U2' R')'");
}

{
  document.querySelector("#puzzle")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      puzzle: "fto",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#puzzle")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.puzzle = "fto";
}

{
  document.querySelector("#visualization")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      visualization: "2D",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#visualization")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.visualization = "2D";
}

{
  document.querySelector("#hint-facelets")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      hintFacelets: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#hint-facelets")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.hintFacelets = "none";
}

{
  document.querySelector("#experimental-stickering")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      experimentalStickering: "OLL",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#experimental-stickering")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.experimentalStickering = "OLL";
}

{
  document.querySelector("#background")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      background: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#background")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.background = "none";
}

{
  document.querySelector("#control-panel")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      controlPanel: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#control-panel")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.controlPanel = "none";
}

{
  document.querySelector("#back-view")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      backView: "side-by-side",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#back-view")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.backView = "side-by-side";
}

{
  document.querySelector("#camera-position")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      cameraPosition: new Vector3(-3, 4, 5),
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#camera-position")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.cameraPosition = new Vector3(-3, 4, 5);
}

{
  document.querySelector("#multiple-attributes")!.appendChild(
    new TwistyPlayer({
      alg: parseAlg("R U R' U R U2' R'"),
      experimentalStickering: "OLL",
      experimentalStartSetup: parseAlg("(R U R' U R U2' R')'"),
      background: "none",
      controlPanel: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#multiple-attributes")!.appendChild(tw);
  tw.alg = parseAlg("R U R' U R U2' R'");
  tw.experimentalStickering = "OLL";
  tw.experimentalStartSetup = parseAlg("(R U R' U R U2' R')'");
  tw.background = "none";
  tw.controlPanel = "none";
}
