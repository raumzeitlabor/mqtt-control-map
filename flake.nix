{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }: lib.flake-utils.eachDefaultSystem (system: {
    packages = rec {
      mqtt-control-map = nixpkgs.legacyPackages."${system}".callPackage ./package.nix { src = ./.; };
      default = mqtt-control-map;
    };
  }
}
