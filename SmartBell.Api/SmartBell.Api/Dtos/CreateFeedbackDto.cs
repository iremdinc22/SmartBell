public record CreateFeedbackDto(
    int Rating,
    List<string>? Tags,
    string? Other,
    string? Comment,
    string StayAgain,
    string? RoomPin
);


