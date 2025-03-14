{ stdenv
, fetchFromGitHub
, fetchYarnDeps
, yarnConfigHook
, yarnBuildHook
, nodejs
, npmHooks
, src
}:

stdenv.mkDerivation (finalAttrs: {
  pname = "mqtt-control-map-rzl";
  version = "0-unstable-2024-11-12";

  inherit src;

  yarnOfflineCache = fetchYarnDeps {
    yarnLock = finalAttrs.src + "/yarn.lock";
    hash = "sha256-obd5k7D21T3HGfS6Y+EfjJELAZyJMa8emPscdPGRD3Q=";
  };

  nativeBuildInputs = [
    yarnConfigHook
    yarnBuildHook
    # Needed for executing package.json scripts
    nodejs
    npmHooks.npmInstallHook
  ];

  yarnBuildFlags = [ "rzl" ];

  dontNpmPrune = true;

  postPhases = [ "outputPhase" ];

  outputPhase = ''
    rm -r $out/lib
    cp -rT dist $out
  '';

})
