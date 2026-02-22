#pragma once
#include "events/DayOfWeek.hpp"
#include "events/TimeOfDay.hpp"
#include <string>

class IPlatform
{
public:
    virtual ~IPlatform() = default;

    virtual bool vaultIsInitialized() = 0;
    virtual bool isBatterySafe() = 0;
    virtual bool isDndDisabled() = 0;

    virtual std::string nowLocalHHMM() = 0;
    virtual std::string todayISODate() = 0;

    virtual void showCallNotification() = 0;
    virtual void clearCallNotification() = 0;
    virtual void startRingtoneAndVibration() = 0;
    virtual void stopRingtoneAndVibration() = 0;

    virtual void appendToDailyNoteMarkdown(const std::string& dateISO, const std::string& line) = 0;
    virtual void saveVoiceMemoPlaceholder(const std::string& fileName) = 0;

    virtual DayOfWeek todayDayOfWeek() = 0;
    virtual TimeOfDay nowTimeOfDay() = 0;
};
