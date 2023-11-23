import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faPhone, faVideo } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ActionButton';
import { socket } from '../communication';

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
    <div>
      <input
        type="text"
        className="txt-clientId"
        defaultValue={clientID}
        readOnly
        onClick={handleCopyToClipboard}
      />
      {isCopied && <p style={{ color: 'navajowhite' }}>Copied to clipboard!</p>}
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
      <div>
        <h1>Welcome to GBU's own video calling app!</h1>
        <h3>
          <br></br>
          This is your ID -
          <CopyToClipboardInput clientID={clientID} />
        </h3>
        <h4>Get started by calling a friend below</h4>
      </div>
      <div>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Your friend's ID"
          onChange={(event) => setFriendID(event.target.value)}
        />
        <div>
          <ActionButton icon={faVideo} onClick={callWithVideo(true)} />
          <ActionButton icon={faPhone} onClick={callWithVideo(false)} />
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
