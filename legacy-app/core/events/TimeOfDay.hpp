#pragma once
#include <cstdint>
#include <string>
#include <stdexcept>

struct TimeOfDay
{
    int hour{0};   // 0-23
    int minute{0}; // 0-59

    static TimeOfDay fromHHMM(const std::string& hhmm)
    {
        // Expect "HH:mm"
        if (hhmm.size() != 5 || hhmm[2] != ':')
            throw std::invalid_argument("TimeOfDay::fromHHMM expects HH:mm");

        int h = std::stoi(hhmm.substr(0, 2));
        int m = std::stoi(hhmm.substr(3, 2));

        if (h < 0 || h > 23 || m < 0 || m > 59)
            throw std::out_of_range("TimeOfDay is out of range");

        return TimeOfDay{h, m};
    }

    int toMinutes() const
    {
        return hour * 60 + minute;
    }
};
