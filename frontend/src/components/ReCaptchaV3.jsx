import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useCallback, useEffect} from "react";

export const ReCaptchaV3 = ({setToken}) => {

    const ReCaptchaComponent = () => {
        const {executeRecaptcha} = useGoogleReCaptcha();

        const handleReCaptchaVerify = useCallback(async () => {
            if (!executeRecaptcha) return;
            setToken(await executeRecaptcha());
        }, [executeRecaptcha]);

        useEffect(() => {
            const interval = setInterval(() => {
                handleReCaptchaVerify();
            }, 1000);

            return () => clearInterval(interval);
        }, [handleReCaptchaVerify]);

        return <></>;
    }

    return (
        <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_CAPTCHA3_SITE_KEY}>
            <ReCaptchaComponent/>
        </GoogleReCaptchaProvider>
    );
}