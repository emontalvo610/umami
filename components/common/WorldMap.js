import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import classNames from 'classnames';
import tinycolor from 'tinycolor2';
import Datamap from 'datamaps';
import useTheme from 'hooks/useTheme';
import { ISO_COUNTRIES, THEME_COLORS } from 'lib/constants';
import styles from './WorldMap.module.css';
import useCountryNames from 'hooks/useCountryNames';
import useLocale from 'hooks/useLocale';

function WorldMap({ data, className }) {
  const [tooltip, setTooltip] = useState();
  const [theme] = useTheme();
  const colors = useMemo(
    () => ({
      baseColor: THEME_COLORS[theme].primary,
      fillColor: THEME_COLORS[theme].gray100,
      strokeColor: THEME_COLORS[theme].primary,
      hoverColor: THEME_COLORS[theme].primary,
    }),
    [theme],
  );
  const [locale] = useLocale();
  const countryNames = useCountryNames(locale);

  function getFillColor(code) {
    if (code === 'AQ') return;
    const country = data?.find(({ x }) => x === code);

    if (!country) {
      return colors.fillColor;
    }

    return tinycolor(colors.baseColor)[theme === 'light' ? 'lighten' : 'darken'](
      40 * (1.0 - country.z / 100),
    );
  }

  function getOpacity(code) {
    return code === 'AQ' ? 0 : 1;
  }

  function handleHover(code) {
    if (code === 'AQ') return;
    const country = data?.find(({ x }) => x === code);
    setTooltip(`${countryNames[code]}: ${country?.y || 0} visitors`);
  }

  return (
    <div
      className={classNames(styles.container, className)}
      data-tip=""
      data-for="world-map-tooltip"
    >
      <ComposableMap projection="geoMercator">
        <ZoomableGroup zoom={0.8} minZoom={0.7} center={[0, 40]}>
          <Geographies geography={Datamap.prototype.worldTopo}>
            {({ geographies }) => {
              return geographies.map(geo => {
                const code = ISO_COUNTRIES[geo.id];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getFillColor(code)}
                    stroke={colors.strokeColor}
                    opacity={getOpacity(code)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: colors.hoverColor },
                      pressed: { outline: 'none' },
                    }}
                    onMouseOver={() => handleHover(code)}
                    onMouseOut={() => setTooltip(null)}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip id="world-map-tooltip">{tooltip}</ReactTooltip>
    </div>
  );
}

WorldMap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.number,
      z: PropTypes.number,
    }),
  ),
  className: PropTypes.string,
};

export default WorldMap;
