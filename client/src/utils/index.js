/* eslint-disable no-useless-escape */
import moment from "moment";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ellipsis = (str) => {
  if (str && str.length > 15) {
    str = str.slice(0, 20) + "...";
  }
  return str;
};

export const timestampToMoment = (timestamp) => {
  const dateTime = moment(timestamp).format("DD-MM-YYYY HH:mm:ss");
  return dateTime;
};

export const validatePhoneNumber = (phoneNumber) => {
  const regexExp = /^[6-9]\d{9}$/gi;
  return regexExp.test(phoneNumber);
};
export const validateEmail = (emailValid) => {
  const regexExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return regexExp.test(emailValid);
};

export const getPath = (pathname) => {
  let name = pathname.split("/")[1];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

//tooltip
export function renderTooltipContent(content, link, maxLength) {
  const shouldApplyEllipsis = content.length > maxLength;

  return (
    <span className={shouldApplyEllipsis ? "ellipsis-wrapper" : ""}>
      {shouldApplyEllipsis ? (
        <OverlayTrigger placement="top" overlay={<Tooltip>{content}</Tooltip>}>
          {link ? (
            <Link to={link} className="ellipsis-link">
              {ellipsis(content)}
            </Link>
          ) : (
            <span>{ellipsis(content)}</span>
          )}
        </OverlayTrigger>
      ) : link ? (
        <Link to={link}>{content}</Link>
      ) : (
        <span>{content}</span>
      )}
    </span>
  );
}
