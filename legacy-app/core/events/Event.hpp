#pragma once
#include "events/DayOfWeek.hpp"
#include "events/TimeOfDay.hpp"
#include <array>
#include <string>

struct Event
{
    std::string name;
    bool enabled{true};

    // recurrence[Mon] = true means event occurs on Monday, etc.
    std::array<bool, 7> recurrence{}; // index matches DayOfWeek enum

    TimeOfDay start;
    TimeOfDay end;

    // Optional prompt override flags could go here later
    // bool overridePrompt{false};
    // std::string promptText;
};
