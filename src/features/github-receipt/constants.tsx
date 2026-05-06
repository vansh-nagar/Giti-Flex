import type { CSSProperties } from "react";

import type { BackgroundItem } from "./types";

const fullCover: CSSProperties = {
  position: "absolute",
  inset: 0,
};

const Gradient3 = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage:
        "repeating-linear-gradient(315deg, #e5e7eb 0, #e5e7eb 1px, transparent 0, transparent 50%)",
      backgroundSize: "10px 10px",
      height: "100%",
      width: "100%",
    }}
  />
);

const Gradient4 = () => (
  <div
    style={{
      height: "100%",
      width: "100%",
      position: "relative",
      backgroundColor: "#ffffff",
    }}
  >
    <div
      style={{
        ...fullCover,
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 2px, transparent 2px), linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
      }}
    />
  </div>
);

const Gradient5 = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage: "radial-gradient(#9ca3af 1px, transparent 0)",
      backgroundSize: "10px 10px",
      opacity: 0.1,
    }}
  />
);

const PatternCrosshatch = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage:
        "repeating-linear-gradient(45deg, transparent 0 11px, #d1d5db 11px 12px), repeating-linear-gradient(-45deg, transparent 0 11px, #d1d5db 11px 12px)",
    }}
  />
);

const PatternStripes = () => (
  <div
    style={{
      ...fullCover,
      backgroundImage:
        "repeating-linear-gradient(45deg, #f3f4f6 0 14px, #ffffff 14px 28px)",
    }}
  />
);

const PatternRings = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage:
        "repeating-radial-gradient(circle at 50% 50%, transparent 0 18px, #d1d5db 18px 19px)",
    }}
  />
);

const PatternBigDots = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage: "radial-gradient(#9ca3af 2.5px, transparent 2.5px)",
      backgroundSize: "22px 22px",
    }}
  />
);

const PatternTriMesh = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#ffffff",
      backgroundImage:
        "repeating-linear-gradient(60deg, transparent 0 19px, #e5e7eb 19px 20px), repeating-linear-gradient(-60deg, transparent 0 19px, #e5e7eb 19px 20px), repeating-linear-gradient(0deg, transparent 0 19px, #e5e7eb 19px 20px)",
    }}
  />
);

const PatternCyberGrid = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#070b1f",
      backgroundImage:
        "linear-gradient(rgba(34, 211, 238, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.35) 1px, transparent 1px), radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.18) 0%, transparent 70%)",
      backgroundSize: "28px 28px, 28px 28px, 100% 100%",
    }}
  />
);

const PatternBlueprint = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#0c4a6e",
      backgroundImage:
        "linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
      backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
    }}
  />
);

const PatternSunburst = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#fef3c7",
      backgroundImage:
        "repeating-conic-gradient(from 0deg at 50% 50%, #fbbf24 0deg 12deg, #fef3c7 12deg 24deg)",
    }}
  />
);

const PatternIridescent = () => (
  <div
    style={{
      ...fullCover,
      background:
        "conic-gradient(from 90deg at 50% 50%, #ff6b6b, #feca57, #48dbfb, #1dd1a1, #5f27cd, #ff6b6b)",
    }}
  />
);

const PatternDarkTopo = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#0f172a",
      backgroundImage:
        "repeating-radial-gradient(circle at 30% 70%, transparent 0 22px, rgba(56, 189, 248, 0.18) 22px 23px), repeating-radial-gradient(circle at 75% 25%, transparent 0 18px, rgba(168, 85, 247, 0.16) 18px 19px)",
    }}
  />
);

const PatternVaporwave = () => (
  <div
    style={{
      ...fullCover,
      backgroundImage:
        "repeating-linear-gradient(0deg, transparent 0 3px, rgba(0, 0, 0, 0.18) 3px 4px), linear-gradient(180deg, #2d1b69 0%, #c026d3 38%, #f97316 70%, #fbbf24 100%)",
    }}
  />
);

const PatternMatrix = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#000000",
      backgroundImage:
        "repeating-linear-gradient(90deg, transparent 0 17px, rgba(34, 197, 94, 0.55) 17px 18px), repeating-linear-gradient(0deg, transparent 0 4px, rgba(0, 0, 0, 0.55) 4px 7px), radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.18) 0%, transparent 70%)",
    }}
  />
);

const PatternSolarFlare = () => (
  <div
    style={{
      ...fullCover,
      backgroundImage:
        "radial-gradient(circle at 50% 100%, #fde047 0%, #f97316 28%, #dc2626 55%, #1e1b4b 100%)",
    }}
  />
);

const PatternNeonHex = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#0a0a14",
      backgroundImage:
        "radial-gradient(ellipse at 50% 50%, rgba(217, 70, 239, 0.22) 0%, transparent 70%), repeating-linear-gradient(60deg, transparent 0 19px, rgba(217, 70, 239, 0.45) 19px 20px), repeating-linear-gradient(-60deg, transparent 0 19px, rgba(34, 211, 238, 0.45) 19px 20px), repeating-linear-gradient(0deg, transparent 0 19px, rgba(168, 85, 247, 0.3) 19px 20px)",
    }}
  />
);

const PatternCosmos = () => (
  <div
    style={{
      ...fullCover,
      backgroundColor: "#020617",
      backgroundImage:
        "radial-gradient(1px 1px at 20px 30px, #ffffff, transparent), radial-gradient(1px 1px at 40px 70px, #ffffff, transparent), radial-gradient(1.5px 1.5px at 90px 40px, #ffffff, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff, transparent), radial-gradient(2px 2px at 60px 110px, #ffffff, transparent), radial-gradient(1px 1px at 110px 130px, #ffffff, transparent), radial-gradient(ellipse at 70% 30%, rgba(168, 85, 247, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(56, 189, 248, 0.15) 0%, transparent 55%)",
      backgroundSize:
        "150px 150px, 150px 150px, 150px 150px, 150px 150px, 150px 150px, 150px 150px, 100% 100%, 100% 100%",
    }}
  />
);

const PatternAurora = () => (
  <div
    style={{
      ...fullCover,
      background:
        "radial-gradient(ellipse at 20% 0%, rgba(34, 197, 94, 0.7) 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(168, 85, 247, 0.65) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(34, 211, 238, 0.55) 0%, transparent 65%), #0a0e27",
    }}
  />
);

export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

export const backgroundOptions: BackgroundItem[] = [
  {
    name: "Nexvyn gradient",
    description: "Soft purple-orange radial",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "radial-gradient(44.02% 44.02% at 14.38% 14.47%, rgba(188, 92, 248, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%), radial-gradient(50.49% 50.49% at 64.54% 12.33%, #EFD0BB 0%, #FFFFFF 100%)",
        }}
      />
    ),
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Standard",
    description: "Original clean look",
    component: <div style={{ ...fullCover, background: "#fff" }} />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Gradient 3",
    description: "Diagonal micro pattern",
    component: <Gradient3 />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Gradient 4",
    description: "Dual grid system",
    component: <Gradient4 />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Gradient 5",
    description: "Dot mesh texture",
    component: <Gradient5 />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Crosshatch",
    description: "Fine 45° X-mesh",
    component: <PatternCrosshatch />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Bold Stripes",
    description: "Wide diagonal stripes",
    component: <PatternStripes />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Concentric Rings",
    description: "Bullseye target",
    component: <PatternRings />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  // {
  //   name: "Chunky Dots",
  //   description: "Bold polka grid",
  //   component: <PatternBigDots />,
  //   backgroundColor: "#ffffff",
  //   text: "#6b7280",
  //   heading: "#1b1b1b",
  // },
  {
    name: "Tri Mesh",
    description: "Triangular line grid",
    component: <PatternTriMesh />,
    backgroundColor: "#ffffff",
    text: "#6b7280",
    heading: "#1b1b1b",
  },
  {
    name: "Cyber Grid",
    description: "Neon cyan on midnight",
    component: <PatternCyberGrid />,
    backgroundColor: "#070b1f",
    text: "#a5f3fc",
    heading: "#67e8f9",
    isDark: true,
  },
  {
    name: "Blueprint",
    description: "Architect graph paper",
    component: <PatternBlueprint />,
    backgroundColor: "#0c4a6e",
    text: "#e0f2fe",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Sunburst",
    description: "Conic golden rays",
    component: <PatternSunburst />,
    backgroundColor: "#fef3c7",
    text: "#7c2d12",
    heading: "#451a03",
  },
  {
    name: "Iridescent",
    description: "Rainbow conic spin",
    component: <PatternIridescent />,
    backgroundColor: "#ff6b6b",
    text: "#ffffff",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Dark Topo",
    description: "Cyber contour lines",
    component: <PatternDarkTopo />,
    backgroundColor: "#0f172a",
    text: "#cbd5e1",
    heading: "#f1f5f9",
    isDark: true,
  },
  {
    name: "Vaporwave",
    description: "Retro sunset scanlines",
    component: <PatternVaporwave />,
    backgroundColor: "#2d1b69",
    text: "#fde68a",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Matrix",
    description: "Terminal green rain",
    component: <PatternMatrix />,
    backgroundColor: "#000000",
    text: "#86efac",
    heading: "#22c55e",
    isDark: true,
  },
  {
    name: "Solar Flare",
    description: "Sunset radial burn",
    component: <PatternSolarFlare />,
    backgroundColor: "#1e1b4b",
    text: "#fef3c7",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Neon Hex",
    description: "Magenta-cyan triangulation",
    component: <PatternNeonHex />,
    backgroundColor: "#0a0a14",
    text: "#f5d0fe",
    heading: "#f0abfc",
    isDark: true,
  },
  {
    name: "Cosmos",
    description: "Deep-space starfield",
    component: <PatternCosmos />,
    backgroundColor: "#020617",
    text: "#cbd5e1",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Aurora",
    description: "Northern lights wash",
    component: <PatternAurora />,
    backgroundColor: "#0a0e27",
    text: "#d1fae5",
    heading: "#ffffff",
    isDark: true,
  },
  {
    name: "Gradient 6",
    description: "Purple-blue angled",
    component: (
      <div
        style={{
          ...fullCover,
          background: "linear-gradient(115.43deg, #1A00FF 0%, #9D00FF 100%)",
        }}
      />
    ),
    backgroundColor: "#2d00ff",
    text: "#e0e7ff",
    heading: "#fff",
    isDark: true,
  },
  {
    name: "Gradient 7",
    description: "Conic sweep",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "conic-gradient(from 135deg at 50% 50%, rgba(0, 0, 0, 0) 0deg, #000000 360deg), conic-gradient(from 44.87deg at 50% 50%, rgba(0, 0, 0, 0) 0deg, #000000 360deg), conic-gradient(from -89.88deg at 50% 50%, #FFFFFF 0deg, #999999 360deg)",
        }}
      />
    ),
    backgroundColor: "#ffffff",
    text: "#4b5563",
    heading: "#000",
  },
  {
    name: "Gradient 8",
    description: "Sunset glow",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "linear-gradient(0.1deg, rgba(255, 74, 74, 0) 0.09%, rgba(255, 36, 36, 0.2) 76.39%), linear-gradient(360deg, #FFF16E 2.67%, #FF8A33 30.48%, #FF4A4A 51.8%), #FF4A4A",
        }}
      />
    ),
    backgroundColor: "#ff4a4a",
    text: "#fff",
    heading: "#fff",
    isDark: true,
  },
  {
    name: "Gradient 10",
    description: "Aurora pill",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "radial-gradient(45.33% 46.43% at 41.69% 50%, #0140FF 0%, rgba(1, 64, 255, 0) 100%), radial-gradient(28.41% 117.96% at 7.72% 28.75%, #A6FDFF 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(37.39% 69.19% at 107.79% 0%, #0075FF 0%, rgba(0, 66, 255, 0) 100%), radial-gradient(54.38% 89.75% at 83.46% 89.75%, #26F9FF 0%, rgba(0, 69, 255, 0.6) 100%), #0140FF",
        }}
      />
    ),
    backgroundColor: "#0140ff",
    text: "#e0f2fe",
    heading: "#fff",
    isDark: true,
  },
  {
    name: "Gradient 11",
    description: "Fiery aurora",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "radial-gradient(45.33% 46.43% at 41.69% 50%, #FF4001 0%, rgba(255, 64, 1, 0) 100%), radial-gradient(28.41% 117.96% at 7.72% 28.75%, #FFFDA6 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(37.39% 69.19% at 107.79% 0%, #FF7500 0%, rgba(255, 66, 0, 0) 100%), radial-gradient(54.38% 89.75% at 83.46% 89.75%, #FFF926 0%, rgba(255, 69, 0, 0.6) 100%), #FF4001",
        }}
      />
    ),
    backgroundColor: "#ff4001",
    text: "#fff7ed",
    heading: "#fff",
    isDark: true,
  },
  {
    name: "Gradient 12",
    description: "Gold shimmer",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "linear-gradient(125.94deg, #AE4E00 0%, #B47E11 25%, #EFD983 39.26%, #FEF1A2 44.41%, #EFD983 49.2%, #BC881B 75%, #A54E07 100%)",
        }}
      />
    ),
    backgroundColor: "#fef1a2",
    text: "#451a03",
    heading: "#78350f",
  },
  {
    name: "Gradient 14",
    description: "Chrome metal",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(0deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.24)), conic-gradient(from 90deg at 50% 50%, #FDFDFD 0deg, #464646 44.35deg, #2C2C2C 56.43deg, #2C2C2C 63.53deg, #595959 77.78deg, #FDFDFD 101.95deg, #B5B5B5 130.71deg, #2C2C2C 158.9deg, #2F2F2F 170.95deg, #2C2C2C 179.09deg, #595959 197.78deg, #FDFDFD 227.8deg, #CDCDCD 240.9deg, #595959 273.03deg, #696969 300.73deg, #8C8C8C 313.13deg, #FDFDFD 360deg)",
        }}
      />
    ),
    backgroundColor: "#fdfdfd",
    text: "#1f2937",
    heading: "#030712",
  },
  {
    name: "Gradient 15",
    description: "Purple metal",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "linear-gradient(99.09deg, rgba(211, 212, 213, 0.15) 12.86%, rgba(139, 145, 147, 0.15) 15.34%, rgba(87, 95, 99, 0.15) 17.82%, rgba(55, 65, 69, 0.15) 18.64%, rgba(43, 54, 58, 0.15) 19.47%, rgba(52, 62, 66, 0.15) 22.77%, rgba(77, 85, 89, 0.15) 26.9%, rgba(117, 123, 126, 0.15) 32.68%, rgba(173, 176, 177, 0.15) 38.46%, rgba(205, 205, 206, 0.15) 41.76%, rgba(198, 199, 200, 0.15) 43.41%, rgba(180, 182, 184, 0.15) 45.06%, rgba(151, 156, 158, 0.15) 46.71%, rgba(111, 118, 122, 0.15) 49.19%, rgba(72, 83, 87, 0.15) 50.84%, rgba(76, 86, 90, 0.15) 52.49%, rgba(89, 98, 102, 0.15) 54.97%, rgba(112, 117, 120, 0.15) 57.45%, rgba(143, 144, 146, 0.15) 59.1%, rgba(152, 152, 154, 0.15) 59.92%, rgba(165, 165, 166, 0.15) 63.23%, rgba(199, 199, 200, 0.15) 70.66%, rgba(255, 255, 255, 0.15) 78.91%, rgba(209, 209, 210, 0.15) 81.39%, rgba(79, 79, 83, 0.15) 87.17%, rgba(27, 27, 32, 0.15) 90.47%, rgba(49, 49, 54, 0.15) 91.3%, rgba(77, 77, 81, 0.15) 92.12%, rgba(116, 116, 118, 0.15) 92.95%, rgba(165, 165, 167, 0.15) 94.6%, rgba(233, 233, 233, 0.15) 95.43%), linear-gradient(0deg, #895DEC, #895DEC), #E8E8E8",
          backgroundBlendMode: "hard-light, normal, normal",
        }}
      />
    ),
    backgroundColor: "#895dec",
    text: "#f5f3ff",
    heading: "#fff",
    isDark: true,
  },
  {
    name: "Gradient 16",
    description: "Steel brushed",
    component: (
      <div
        style={{
          ...fullCover,
          background:
            "linear-gradient(99.09deg, rgba(211, 212, 213, 0.18) 12.86%, rgba(139, 145, 147, 0.18) 15.34%, rgba(87, 95, 99, 0.18) 17.82%, rgba(55, 65, 69, 0.18) 18.64%, rgba(43, 54, 58, 0.18) 19.47%, rgba(52, 62, 66, 0.18) 22.77%, rgba(77, 85, 89, 0.18) 26.9%, rgba(117, 123, 126, 0.18) 32.68%, rgba(173, 176, 177, 0.18) 38.46%, rgba(205, 205, 206, 0.18) 41.76%, rgba(198, 199, 200, 0.18) 43.41%, rgba(180, 182, 184, 0.18) 45.06%, rgba(151, 156, 158, 0.18) 46.71%, rgba(111, 118, 122, 0.18) 49.19%, rgba(72, 83, 87, 0.18) 50.84%, rgba(76, 86, 90, 0.18) 52.49%, rgba(89, 98, 102, 0.18) 54.97%, rgba(112, 117, 120, 0.18) 57.45%, rgba(143, 144, 146, 0.18) 59.1%, rgba(152, 152, 154, 0.18) 59.92%, rgba(165, 165, 166, 0.18) 63.23%, rgba(199, 199, 200, 0.18) 70.66%, rgba(255, 255, 255, 0.18) 78.91%, rgba(209, 209, 210, 0.18) 81.39%, rgba(79, 79, 83, 0.18) 87.17%, rgba(27, 27, 32, 0.18) 90.47%, rgba(49, 49, 54, 0.18) 91.3%, rgba(77, 77, 81, 0.18) 92.12%, rgba(116, 116, 118, 0.18) 92.95%, rgba(165, 165, 167, 0.18) 94.6%, rgba(233, 233, 233, 0.18) 95.43%), linear-gradient(273.67deg, #E8E8E8 19.03%, #F9F9F9 80.97%)",
          backgroundBlendMode: "hard-light, normal",
        }}
      />
    ),
    backgroundColor: "#f9f9f9",
    text: "#4b5563",
    heading: "#111827",
  },
];
