import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

const Login = () => {
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState("");
  const [show, setshow] = useState(false);
  const [final, setfinal] = useState("");

  const signin = () => {
    if (mynumber === "" || mynumber.length < 10) return;

    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved - will proceed with submit
      }
    });

    const phoneNumberString = `+84${mynumber}`; // Assuming Vietnamese country code
    
    signInWithPhoneNumber(auth, phoneNumberString, appVerifier)
      .then((confirmationResult) => {
        setfinal(confirmationResult);
        alert("Code sent");
        setshow(true);
      })
      .catch((error) => {
        alert(error.message);
        window.location.reload();
      });
  };

  const validateOtp = () => {
    if (otp === null || final === null) return;

    final.confirm(otp)
      .then((result) => {
        // Successfully signed in
        alert("Successfully signed in");

        // Generate and retrieve token
        const user = result.user;
        user.getIdToken().then((token) => {
          console.log('Token:', token);
          // You can now use the token for authenticated requests
          // For example, send it to your server for verification
        }).catch((error) => {
          console.error("Error getting token:", error);
        });
      })
      .catch((error) => {
        alert("Wrong code");
      });
  };

  return (
    <div style={{ marginTop: "200px" }}>
      <center>
        <div style={{ display: !show ? "block" : "none" }}>
          <input
            value={mynumber}
            onChange={(e) => setnumber(e.target.value)}
            placeholder="Phone number"
          />
          <br />
          <br />
          <div id="recaptcha-container"></div>
          <button onClick={signin}>Send OTP</button>
        </div>
        <div style={{ display: show ? "block" : "none" }}>
          <input
            type="text"
            placeholder="Enter your OTP"
            onChange={(e) => setotp(e.target.value)}
          />
          <br />
          <br />
          <button onClick={validateOtp}>Verify</button>
        </div>
      </center>
    </div>
  );
};

export default Login;
