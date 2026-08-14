import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import AppShell from "@/app/AppShell";
import "./index.css";

const GetStartedPage = lazy(() => import("@/pages/GetStartedPage"));
const ExamplePage = lazy(() => import("@/pages/ExamplePage"));
const UpdatesPage = lazy(() => import("@/pages/UpdatesPage"));
const TypographyPage = lazy(() => import("@/pages/design/TypographyPage"));
const IconsPage = lazy(() => import("@/pages/design/IconsPage"));
const foundations = () => import("@/pages/design/FoundationsPages");
const structure = () => import("@/pages/design/StructurePages");
const GridPage = lazy(() => foundations().then((module) => ({ default: module.GridPage })));
const ElevationPage = lazy(() => foundations().then((module) => ({ default: module.ElevationPage })));
const PrimitiveColorsPage = lazy(() => foundations().then((module) => ({ default: module.PrimitiveColorsPage })));
const ColorTokensPage = lazy(() => foundations().then((module) => ({ default: module.ColorTokensPage })));
const IdentityPage = lazy(() => foundations().then((module) => ({ default: module.IdentityPage })));
const CommonImagesPage = lazy(() => foundations().then((module) => ({ default: module.CommonImagesPage })));
const PrinciplesPage = lazy(() => structure().then((module) => ({ default: module.PrinciplesPage })));
const ComponentDocPage = lazy(() => import("@/pages/design/ComponentPages").then((module) => ({ default: module.ComponentDocPage })));
const StructureContentPage = lazy(() => structure().then((module) => ({ default: module.ContentPage })));
const PatternPage = lazy(() => structure().then((module) => ({ default: module.PatternPage })));
const BestPracticePage = lazy(() => structure().then((module) => ({ default: module.BestPracticePage })));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <GetStartedPage /> },
      { path: "example", element: <ExamplePage /> },
      { path: "updates", element: <UpdatesPage /> },
      { path: "design-principles", element: <PrinciplesPage /> },
      { path: "foundations/grid", element: <GridPage /> },
      { path: "foundations/elevation", element: <ElevationPage /> },
      { path: "foundations/primitive-color", element: <PrimitiveColorsPage /> },
      { path: "foundations/color-token", element: <ColorTokensPage /> },
      { path: "foundations/typography", element: <TypographyPage /> },
      { path: "foundations/iconography", element: <IconsPage /> },
      { path: "foundations/identity", element: <IdentityPage /> },
      { path: "foundations/common-image", element: <CommonImagesPage /> },
      { path: "content/voice-tone", element: <StructureContentPage kind="voice-tone" /> },
      { path: "content/writing-style", element: <StructureContentPage kind="writing-style" /> },
      { path: "content/vocabulary", element: <StructureContentPage kind="vocabulary" /> },
      { path: "components/button", element: <ComponentDocPage kind="button" /> },
      { path: "components/label-helper", element: <ComponentDocPage kind="label-helper" /> },
      { path: "components/text-field", element: <ComponentDocPage kind="text-field" /> },
      { path: "components/text-area", element: <ComponentDocPage kind="text-area" /> },
      { path: "components/selection-control", element: <ComponentDocPage kind="selection-control" /> },
      { path: "components/dropdown", element: <ComponentDocPage kind="dropdown" /> },
      { path: "components/date-picker", element: <ComponentDocPage kind="date-picker" /> },
      { path: "components/slider", element: <ComponentDocPage kind="slider" /> },
      { path: "components/chip", element: <ComponentDocPage kind="chip" /> },
      { path: "components/menu", element: <ComponentDocPage kind="menu" /> },
      { path: "components/snackbar", element: <ComponentDocPage kind="snackbar" /> },
      { path: "components/tab", element: <ComponentDocPage kind="tab" /> },
      { path: "components/pagination", element: <ComponentDocPage kind="pagination" /> },
      { path: "components/badge", element: <ComponentDocPage kind="badge" /> },
      { path: "components/rating", element: <ComponentDocPage kind="rating" /> },
      { path: "components/progress-indicator", element: <ComponentDocPage kind="progress-indicator" /> },
      { path: "components/chart", element: <ComponentDocPage kind="chart" /> },
      { path: "components/divider", element: <ComponentDocPage kind="divider" /> },
      { path: "components/dialog", element: <ComponentDocPage kind="dialog" /> },
      { path: "components/section-message", element: <ComponentDocPage kind="section-message" /> },
      { path: "components/description", element: <ComponentDocPage kind="description" /> },
      { path: "patterns/bottom-navigation", element: <PatternPage kind="bottom-navigation" /> },
      { path: "patterns/app-bar", element: <PatternPage kind="app-bar" /> },
      { path: "patterns/subheader", element: <PatternPage kind="subheader" /> },
      { path: "patterns/list", element: <PatternPage kind="list" /> },
      { path: "patterns/image-list", element: <PatternPage kind="image-list" /> },
      { path: "best-practices/content", element: <BestPracticePage kind="content" /> },
      { path: "best-practices/setting", element: <BestPracticePage kind="setting" /> },
      { path: "best-practices/search", element: <BestPracticePage kind="search" /> },
      { path: "best-practices/fieldset", element: <BestPracticePage kind="fieldset" /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
