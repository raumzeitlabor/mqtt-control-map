# MQTT Control Map

## Local Development / Configuration

* run `yarn` to install all dependencies.
* for local development issue an `export NODE_OPTIONS=--openssl-legacy-provider`for webpack to work
* run `yarn watch CONFIG` to run a local build server that automatically builds
your the mqtt control map for the given CONFIG everytime something changes.
* run `yarn dev CONFIG` to create just a single build of the mqtt control map
for the given config.
* run `yarn build CONFIG` to generate all files for production use.

## Production Deployment
1. Commit your changes into the repository https://github.com/raumzeitlabor/mqtt-control-map
1. Login into apfelkirsch.raumzeitlabor.de
1. Change `/etc/nixos/config/web/mqtt-control-map-rzl.nix`
    * Update the variable `rev` and `hash` to the values you get from the command `nix-shell -p nix-prefetch-github --run 'nix-prefetch-github raumzeitlabor mqtt-control-map'`.
      ```
      $ nix-shell -p nix-prefetch-github --run 'nix-prefetch-github raumzeitlabor mqtt-control-map'
      {
          "owner": "raumzeitlabor",
          "repo": "mqtt-control-map",
          "rev": "fb8ffc992727f21929cd77a54460bae06236c28c",
          "hash": "sha256-aj84C04oYqO3Ho7NOcB8JuDOJ9wFruQaTusiHElBl0Q="
      }
      ```
1. Rebuild the system by using `nixos-rebuild switch`

## Documentation

The documentation can be found in our [mqtt-control-map wiki](https://github.com/uwap/mqtt-control-map/wiki).
