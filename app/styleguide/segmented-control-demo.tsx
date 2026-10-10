"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

const options = [
  { value: "4", label: "4W" },
  { value: "8", label: "8W" },
  { value: "12", label: "12W" },
  { value: "52", label: "1Y" },
];

export function SegmentedControlDemo() {
  const [value, setValue] = useState("12");
  return <SegmentedControl label="Time range" options={options} value={value} onChange={setValue} />;
}
