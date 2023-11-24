import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ActionButton';
import { socket } from '../communication';
import logo from '../components/assets/logo.svg'

// Include the CopyToClipboardInput component here
function CopyToClipboardInput({ clientID }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const inputElement = document.querySelector('.txt-clientId');

    if (inputElement) {
      inputElement.select();
      document.execCommand('copy');
      setIsCopied(true);

      // Reset the "Copied" message after a short delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div className='copyID'>
      <input
        type="text"
        className="txt-clientId"
        defaultValue={clientID}
        readOnly
        onClick={handleCopyToClipboard}
      />
      {isCopied && <p style={{ color: 'blue', marginTop: '2rem' }}>Copied to clipboard!</p>}
    </div>
  );
}

function useClientID() {
  const [clientID, setClientID] = useState('');

  useEffect(() => {
    socket
      .on('init', ({ id }) => {
        document.title = `${id} - VideoCall`;
        setClientID(id);
      });
  }, []);

  return clientID;
}

function MainWindow({ startCall }) {
  const clientID = useClientID();
  const [friendID, setFriendID] = useState(null);

  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="container main-window">
      <div className='flex'>
        <h4 className='muted'>Welcome to</h4>
        <img src={logo} alt="logo" />
        <h4 className='muted'>GBU's very own video calling app!</h4>
        <div className='roundBox'>

          <h3 className='inputTitle'>
            Your connection ID –<span style={{ color: '#00000099', fontWeight: 100 }}> share it with the friend you want to call.</span>
            <CopyToClipboardInput clientID={clientID} />
          </h3>
          <div className='alreadyID'><h4>Already have an ID? Enter it below –</h4>
            <div>
              <input
                type="text"
                className="txt-clientId"
                spellCheck={false}
                placeholder="Your friend's ID"
                onChange={(event) => setFriendID(event.target.value)}
              /></div></div>

          <div className='callButtons'>
            <ActionButton icon={faVideo} onClick={callWithVideo(true)} />
            <ActionButton icon={faPhone} onClick={callWithVideo(false)} />
          </div>

        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
