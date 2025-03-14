import { filterCoursesByYear } from "../courses.js";

describe("filterCoursesByYear function", () => {
  const sampleCourses = [
    { title: "CS101", year: "2024" },
    { title: "CS102", year: "2023" },
    { title: "CS201", year: "2024" }
  ];

  test("should return only courses for the specified year", () => {
    const result = filterCoursesByYear(sampleCourses, "2024");
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { title: "CS101", year: "2024" },
      { title: "CS201", year: "2024" }
    ]);
  });

  test("should return an empty array if no courses match the year", () => {
    const result = filterCoursesByYear(sampleCourses, "2025");
    expect(result).toEqual([]);
  });
});
