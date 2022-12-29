import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Google = () => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
        console.log(jwt_decode(credentialResponse.credential));
        axios({
          method: "POST",
          url: `${process.env.REACT_APP_CLIENT_URL}/google-login`,
          data: { idToken: credentialResponse.credential },
        })
          .then((res) => {
            console.log("GO GO one", res);
          })
          .catch((err) => console.log("GOogle Auth Failed", err));
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default Google;
