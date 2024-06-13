import React, { useState } from 'react';
import './Content.css';
import { StationInventoryEN } from './csv/Station Inventory EN.csv.js';
import { station6720 } from './csv/6720.csv.js';
import { station6633 } from './csv/6633.csv.js';
import { station6358 } from './csv/6358.csv.js';
import { station6207 } from './csv/6207.csv.js';
import { station5415 } from './csv/5415.csv.js';
import { station5251 } from './csv/5251.csv.js';
import { station5097 } from './csv/5097.csv.js';
import { station4932 } from './csv/4932.csv.js';
import { station4789 } from './csv/4789.csv.js';
import { station4337 } from './csv/4337.csv.js';
import { station3698 } from './csv/3698.csv.js';
import { station3328 } from './csv/3328.csv.js';
import { station3002 } from './csv/3002.csv.js';
import { station2205 } from './csv/2205.csv.js';
import { station1865 } from './csv/1865.csv.js';
import { station118 } from './csv/118.csv.js';

const provinces = [
  'ALBERTA',
  'BRITISH COLUMBIA',
  'MANITOBA',
  'NEW BRUNSWICK',
  'NEWFOUNDLAND',
  'NOVA SCOTIA',
  'ONTARIO',
  'PRINCE EDWARD ISLAND',
  'QUEBEC',
  'SASKATCHEWAN'
];

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const stationData = {
  '6720': station6720,
  '6633': station6633,
  '6358': station6358,
  '6207': station6207,
  '5415': station5415,
  '5251': station5251,
  '5097': station5097,
  '4932': station4932,
  '4789': station4789,
  '4337': station4337,
  '3698': station3698,
  '3328': station3328,
  '3002': station3002,
  '2205': station2205,
  '1865': station1865,
  '118': station118
};

const loadStationData = (stationCode) => {
  console.log(stationCode);
  const data = stationData[stationCode];
  if (data) {
    return data
      .trim()
      .split("\n")
      .slice(1)
      .map((s) => s.replace(/"/g, "").split(","));
  } else {
    console.error(`Les données pour la station n'ont pas été trouvées.`);
    return [];
  }
};

function Content() {
  const [showAllStations, setShowAllStations] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [view, setView] = useState('data');
  const [dateRange, setDateRange] = useState({ startYear: null, startMonth: null, endYear: null, endMonth: null });

  const stationInfo = StationInventoryEN
    .trim()
    .split("\n")
    .slice(5)
    .map((s) => s.replace(/"/g, "").split(","));

  const handleProvinceClick = (province) => {
    if (province === selectedProvince) {
      setSelectedProvince(null);
    } else {
      setSelectedProvince(province);
      setShowAllStations(false);
    }
  };

  const handleAllStationsClick = () => {
    setShowAllStations(!showAllStations);
    setSelectedProvince(null);
  };

  const handleStationClick = (station) => {
    setSelectedStation(station === selectedStation ? null : station);
    if (station !== selectedStation) {
      const stationData = getStationData(station);
      if (stationData.length > 0) {
        const firstDate = stationData[0][4].split('-');
        const lastDate = stationData[stationData.length - 1][4].split('-');
        setDateRange({
          startYear: firstDate[0],
          startMonth: firstDate[1],
          endYear: lastDate[0],
          endMonth: lastDate[1]
        });
      }
    }
  };

  const handleDateChange = (type, value) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
  };

  const resetDateRange = () => {
    if (selectedStation) {
      const stationData = getStationData(selectedStation);
      if (stationData.length > 0) {
        const firstDate = stationData[0][4].split('-');
        const lastDate = stationData[stationData.length - 1][4].split('-');
        setDateRange({
          startYear: firstDate[0],
          startMonth: firstDate[1],
          endYear: lastDate[0],
          endMonth: lastDate[1]
        });
      }
    }
  };

  const getStationData = (stationName) => {
    const stationCode = stationInfo.find(info => info[0] === stationName)[3];
    return loadStationData(stationCode);
  };

  const filteredData = () => {
    const allData = getStationData(selectedStation);
    if (!dateRange.startYear || !dateRange.startMonth || !dateRange.endYear || !dateRange.endMonth) {
      return allData;
    }

    const startDate = new Date(dateRange.startYear, dateRange.startMonth - 1);
    const endDate = new Date(dateRange.endYear, dateRange.endMonth - 1);

    return allData.filter(data => {
      const [year, month] = data[4].split('-').map(Number);
      const date = new Date(year, month - 1);
      return date >= startDate && date <= endDate;
    });
  };

  return (
    <div className="content">
      <div className="provinces-container">
        <div className="provinces-scrollable">
          <div>
            <button onClick={handleAllStationsClick}>TOUTES LES STATIONS</button>
            {showAllStations && (
              <ul>
                {stationInfo.map((stationData, index) => (
                  <li key={index}>
                    <a href="#" onClick={() => handleStationClick(stationData[0])}>
                      {stationData[0]} ({stationData[5]})
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {provinces.map((province) => (
            <div key={province}>
              <button
                onClick={() => handleProvinceClick(province)}
                className={selectedProvince === province ? 'selected' : ''}
              >
                {province}
              </button>
              {selectedProvince === province && (
                <ul>
                  {stationInfo.map((stationData, index) => {
                    if (stationData[1] === province) {
                      return (
                        <li key={index}>
                          <a
                            href="#"
                            onClick={() => handleStationClick(stationData[0])}
                            className={selectedStation === stationData[0] ? 'stationSelected' : ''}
                          >
                            {stationData[0]} ({stationData[5]})
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="information-container">
        {selectedStation && (
          <div>
            <h2>{selectedStation}</h2>
            <div className="date-range-selector">
              <label>
                Début :
                <select value={dateRange.startYear} onChange={(e) => handleDateChange('startYear', e.target.value)}>
                  {getStationData(selectedStation).map(data => data[5]).filter((value, index, self) => self.indexOf(value) === index).map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
                <select value={dateRange.startMonth} onChange={(e) => handleDateChange('startMonth', e.target.value)}>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </label>
              <label>
                Fin :
                <select value={dateRange.endYear} onChange={(e) => handleDateChange('endYear', e.target.value)}>
                  {getStationData(selectedStation).map(data => data[5]).filter((value, index, self) => self.indexOf(value) === index).map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
                <select value={dateRange.endMonth} onChange={(e) => handleDateChange('endMonth', e.target.value)}>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </label>
              <button onClick={resetDateRange}>Toutes les données</button>
            </div>
            <div className="view-buttons">
              <button onClick={() => setView('data')} className={view === 'data' ? 'active' : ''}>Données</button>
              <button onClick={() => setView('stats')} className={view === 'stats' ? 'active' : ''}>Statistiques</button>
            </div>
            {view === 'data' && (
              <div className="data-view">
                <table>
                  <thead>
                    <tr>
                      <th>Année</th>
                      <th>Mois</th>
                      <th>Temp Max Moy (°C)</th>
                      <th>Temp Min Moy (°C)</th>
                      <th>Temp Moy (°C)</th>
                      <th>Temp Max (°C)</th>
                      <th>Temp Min (°C)</th>
                      <th>Pluie Totale (mm)</th>
                      <th>Neige Totale (cm)</th>
                      <th>Vent Max (km/h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData().map((data, index) => (
                      <tr key={index}>
                        <td>{data[5]}</td>
                        <td>{months[parseInt(data[6], 10) - 1]}</td>
                        <td>{data[7]}</td>
                        <td>{data[9]}</td>
                        <td>{data[11]}</td>
                        <td>{data[13]}</td>
                        <td>{data[15]}</td>
                        <td>{data[17]}</td>
                        <td>{data[19]}</td>
                        <td>{data[27]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {view === 'stats' && (
              <div className="stats-view">
                <p>TODO Stats</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
