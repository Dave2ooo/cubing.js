import { Vector3 } from "three";
import { parse } from "../../src/alg";
import {
  experimentalSetShareAllNewRenderers,
  TwistyPlayer,
} from "../../src/twisty";

experimentalSetShareAllNewRenderers(true);

{
  document.querySelector("#no-attributes")!.appendChild(new TwistyPlayer());
}

{
  document.querySelector("#alg")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#alg")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.alg = parse("R U R'");
}

{
  document.querySelector("#visualization")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      visualization: "2D",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#visualization")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.visualization = "2D";
}

{
  document.querySelector("#hint-facelets")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      hintFacelets: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#hint-facelets")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.hintFacelets = "none";
}

{
  document.querySelector("#experimental-stickering")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      experimentalStickering: "OLL",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#experimental-stickering")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.experimentalStickering = "OLL";
}

{
  document.querySelector("#background")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      background: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#background")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.background = "none";
}

{
  document.querySelector("#controls")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      controls: "none",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#controls")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.controls = "none";
}

{
  document.querySelector("#back-view")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      backView: "side-by-side",
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#back-view")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.backView = "side-by-side";
}

{
  document.querySelector("#camera-position")!.appendChild(
    new TwistyPlayer({
      alg: parse("R U R' U R U2' R'"),
      cameraPosition: new Vector3(-3, 4, 5),
    }),
  );
  const tw = new TwistyPlayer();
  document.querySelector("#camera-position")!.appendChild(tw);
  tw.alg = parse("R U R' U R U2' R'");
  tw.cameraPosition = new Vector3(-3, 4, 5);
}
