import React from "react";
import { Text } from "@faharmony/components";

const boxStyle = { width: "100%" };

/**
 * @author Siddhant Gupta <siddhant@fasolutions.com>
 * Custom component built to do repetitive task.
 * In future this can become a part of Harmony.
 */
export const Boxes = (obj: Object, isHorizontal: boolean = false) => {
  const InfoBox = ({ field, value }: { field: string; value: string }) => (
    <div style={boxStyle}>
      <Text variant="h6" value={field} />
      {isHorizontal ? ": " : <br />}
      <Text value={value} />
    </div>
  );

  return Object.entries(obj).map((item) => {
    const field = item[0];
    const value = item[1];
    const type = typeof value;
    return type === "object" ? (
      Array.isArray(value) ? (
        <InfoBox field={field} value={value.join(", ")} />
      ) : (
        <div key={field}>
          <Text value={field} variant="h5" />
          {Boxes(value, true)}
        </div>
      )
    ) : (
      <InfoBox field={field} value={value} />
    );
  });
};

export default Boxes;
