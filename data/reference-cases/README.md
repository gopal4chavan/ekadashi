# Independent astronomy reference cases

Add Swiss Ephemeris or other independently reviewed reference cases here before claiming the astronomy adapter has been validated. Each entry should record its source, UTC instant, coordinates, timezone, expected Sun/Moon longitudes, angular difference, and (where available) sunrise/sunset.

The empty fixture is intentional: no reference values are fabricated. Review the chosen Swiss Ephemeris package's licence before adding it to a distributed/browser build. The comparison helpers accept a provider-independent reference case so a validation implementation can stay outside the production bundle.
