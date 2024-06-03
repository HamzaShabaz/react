import React, { useState } from "react";
// import { Tooltip } from "antd";

const TextShortener = ({
  text,
  textLimit,
  component,
  tooltipColor,
  className,
  tooltipClassname,
  tooltipStyle
}) => {
  const tooltipId = Math.random().toString(36).substring(7);
  const Component = component;

  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };
  if (component === "") {
    return text.length > textLimit ? (
      <div
        className="Tooltip-Wrapper"
        // When to show the tooltip
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
      >
        {text.substring(0, textLimit - 3) + "..."}
        {active && (
          <div className={`Tooltip-Tip ${"top"} ${tooltipClassname}`} style={{...tooltipStyle}}>
            {/* Content */}
            {text}
          </div>
        )}
      </div>
    ) : (
      <>{text}</>
    );
  }

  return text?.length > textLimit ? (
    <Component
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {text.substring(0, textLimit - 3) + "..."}
      {active && (
        <span style={{...tooltipStyle}} className={`Tooltip-Tip ${"top"} ${tooltipClassname}`}>
          {/* Content */}
          {text}
        </span>
      )}
    </Component>
  ) : (
    <Component className={className}>{text}</Component>
  );
};

export default TextShortener;
