import { fireEvent, render, screen } from "@testing-library/react";
import { MeetingBallot } from "@/components/concepts/meeting-ballot";

describe("meeting ballot", () => {
  it("renders one radio choice for each concept and declares that it is local-only", () => {
    render(<MeetingBallot />);

    expect(screen.getByRole("heading", { name: /ballot|vote|方案/i })).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
    expect(screen.getByText(/local[- ]only|仅本地|本地投票/i)).toBeVisible();
    expect(
      screen.getByText(/no shared backend|not sent|facilitator|不会提交|未连接后台/i),
    ).toBeVisible();

    for (const label of ["Academic Registry", "Domain Atlas", "Quality Lab", "Composition Studio"]) {
      expect(screen.getByRole("radio", { name: new RegExp(label, "i") })).toBeVisible();
    }
  });

  it("lets the facilitator select and confirm a local choice", () => {
    render(<MeetingBallot />);

    const choice = screen.getByRole("radio", { name: /Domain Atlas/i });
    fireEvent.click(choice);
    expect(choice).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /confirm|select|record|提交|确认/i }));
    expect(
      screen.getByText(/selected|recorded|local choice|已选择|已记录/i),
    ).toBeVisible();
    expect(screen.getByText(/Domain Atlas/i)).toBeVisible();
  });

  it("localizes the ballot labels for the Chinese concept gallery", () => {
    render(<MeetingBallot locale="zh" />);

    expect(screen.getByRole("radio", { name: /领域图谱/ })).toBeVisible();
    expect(screen.getByRole("radio", { name: /质控实验台/ })).toBeVisible();
    expect(screen.getByText("仅本地投票 · 未连接共享后台")).toBeVisible();
  });
});
