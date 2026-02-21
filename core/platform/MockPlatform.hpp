// will be replaced with actual platform implementation later
#pragma once
#include "core/IPlatform.hpp"
#include "core/ILogger.hpp"
#include <string>

class MockPlatform : public IPlatform
{
public:
    explicit MockPlatform(ILogger& logger);

    bool vaultIsInitialized() override;
    bool isBatterySafe() override;
    bool isDndDisabled() override;

    std::string nowLocalHHMM() override;
    std::string todayISODate() override;

    void showCallNotification() override;
    void clearCallNotification() override;
    void startRingtoneAndVibration() override;
    void stopRingtoneAndVibration() override;

    void appendToDailyNoteMarkdown(const std::string& dateISO, const std::string& line) override;
    void saveVoiceMemoPlaceholder(const std::string& fileName) override;
    DayOfWeek todayDayOfWeek() override;
    TimeOfDay nowTimeOfDay() override;

private:
    ILogger& m_logger;
};
