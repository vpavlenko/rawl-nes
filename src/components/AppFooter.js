import React from 'react';
import diceImage from '../images/dice.png';
import linkImage from '../images/link.png';
import repeatImage from '../images/repeat.png';
import TimeSlider from './TimeSlider';
import { VolumeSlider } from './VolumeSlider';
import FavoriteButton from './FavoriteButton';
import PlayerParams from './PlayerParams';
import { pathToLinks } from '../util';
import { REPEAT_LABELS } from '../Sequencer';

export default class AppFooter extends React.PureComponent {
  render() {
    const {
      // this.state.
      currentSongDurationMs,
      currentSongNumSubtunes,
      currentSongNumVoices,
      currentSongSubtune,
      ejected,
      faves,
      imageUrl,
      infoTexts,
      paused,
      playerError,
      repeat,
      showPlayerSettings,
      songUrl,
      subtitle,
      tempo,
      title,
      voiceNames,
      voiceMask,
      volume,

      // this.
      getCurrentSongLink,
      handleCycleRepeat,
      handlePlayerError,
      handlePlayRandom,
      handleSetVoiceMask,
      handleTempoChange,
      handleTimeSliderChange,
      handleToggleFavorite,
      handleVolumeChange,
      nextSong,
      nextSubtune,
      prevSong,
      prevSubtune,
      sequencer,
      toggleInfo,
      togglePause,
      toggleSettings,
    } = this.props;

    const pathLinks = pathToLinks(songUrl);

    return (
      <div className="AppFooter">
        <div className="AppFooter-main">
          <div className="AppFooter-main-inner">
            <button onClick={prevSong}
                    className="box-button"
                    disabled={ejected}>
              &lt;
            </button>
            {' '}
            <button onClick={togglePause}
                    className="box-button"
                    disabled={ejected}>
              {paused ? 'Resume' : 'Pause'}
            </button>
            {' '}
            <button onClick={nextSong}
                    className="box-button"
                    disabled={ejected}>
              &gt;
            </button>
            {' '}
            {currentSongNumSubtunes > 1 &&
            <span style={{ whiteSpace: 'nowrap' }}>
              Tune {currentSongSubtune + 1} of {currentSongNumSubtunes}{' '}
              <button
                className="box-button"
                disabled={ejected}
                onClick={prevSubtune}>&lt;
              </button>
              {' '}
              <button
                className="box-button"
                disabled={ejected}
                onClick={nextSubtune}>&gt;
              </button>
            </span>}
            <span className="AppFooter-more-buttons">
              <button title="Cycle Repeat (repeat off, repeat all songs in the context, or repeat one song)" className="box-button" onClick={handleCycleRepeat}>
                <img alt="Repeat" src={repeatImage} style={{ verticalAlign: 'bottom' }}/>
                {REPEAT_LABELS[repeat]}
              </button>
              {' '}
              <button title="Jump to a random song in the entire collection" className="box-button" onClick={handlePlayRandom}>
                <img alt="Roll the dice" src={diceImage} style={{ verticalAlign: 'bottom' }}/>
                Random
              </button>
              {' '}
              {!showPlayerSettings &&
              <button className="box-button" onClick={toggleSettings}>
                Settings &gt;
              </button>}
            </span>
            {playerError &&
            <div className="App-error">ERROR: {playerError}
              {' '}
              <button  onClick={() => handlePlayerError(null)}>[x]</button>
            </div>
            }
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <TimeSlider
                currentSongDurationMs={currentSongDurationMs}
                getCurrentPositionMs={() => {
                  // TODO: reevaluate this approach
                  if (sequencer && sequencer.getPlayer()) {
                    return sequencer.getPlayer().getPositionMs();
                  }
                  return 0;
                }}
                onChange={handleTimeSliderChange}/>
              <VolumeSlider
                onChange={(e) => {
                  handleVolumeChange(e.target.value);
                }}
                handleReset={(e) => {
                  handleVolumeChange(100);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                title="Double-click or right-click to reset to 100%."
                value={volume}/>
            </div>
            {!ejected &&
            <div className="SongDetails">
              {faves && songUrl &&
              <div style={{ float: 'left', marginBottom: '58px' }}>
                <FavoriteButton isFavorite={faves.includes(songUrl)}
                                toggleFavorite={handleToggleFavorite}
                                href={songUrl}/>
              </div>}
              <div className="SongDetails-title">
                <a style={{ color: 'var(--neutral4)' }} href={getCurrentSongLink()}>
                  {title}{' '}
                  <img alt="Copy link" src={linkImage} style={{ verticalAlign: 'bottom' }}/>
                </a>
                {' '}
                {infoTexts.length > 0 &&
                <a onClick={(e) => toggleInfo(e)} href='#'>
                  тхт
                </a>
                }
              </div>
              <div className="SongDetails-subtitle">{subtitle}</div>
              <div className="SongDetails-filepath">{pathLinks}</div>
            </div>}
          </div>
        </div>
        {showPlayerSettings &&
        <div className="AppFooter-settings">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '19px'
          }}>
            <h3 style={{ margin: '0 8px 0 0' }}>Player Settings</h3>
            <button className='box-button' onClick={toggleSettings}>
              Close
            </button>
          </div>
          {sequencer.getPlayer() ?
            <PlayerParams
              ejected={ejected}
              tempo={tempo}
              numVoices={currentSongNumVoices}
              voiceMask={voiceMask}
              voiceNames={voiceNames}
              handleTempoChange={handleTempoChange}
              handleSetVoiceMask={handleSetVoiceMask}
              getParameter={sequencer.getPlayer().getParameter}
              setParameter={sequencer.getPlayer().setParameter}
              paramDefs={sequencer.getPlayer().getParamDefs()}/>
            :
            <div>(No active player)</div>}
        </div>}
        {imageUrl &&
        <img alt="Cover art" className="AppFooter-art" src={imageUrl}/>}
      </div>
    );
  }
}
