import Axios from "axios";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = (response) => {
    Axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/api/facebook-login`,
      data: { userID: response.userID, accessToken: response.accessToken },
    })
      .then((response) => {
        console.log("FACEBOOK LOGIN SUCCESS, ", response);
        //! inform Parent component
        informParent(response);
      })
      .catch((error) => console.log("FACEBOOK LOGIN FALED", error.reponse));
  };
  return (
    <FacebookLogin
      appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
      autoLoad={false}
      callback={responseFacebook}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="btn btn-primary btn-lg btn-block"
        >
          <i class="fa-brands fa-facebook-f pr-2"></i> Continue with Facebook
        </button>
      )}
    />
  );
};

export default Facebook;
