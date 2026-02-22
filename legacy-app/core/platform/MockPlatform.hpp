// will be replaced with actual platform implementation later
#pragma once
#include "core/IPlatform.hpp"
#include "logging/ILogger.hpp"
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
    // Debug/test controls
    void setVaultInitialized(bool v);
    void setBatterySafe(bool v);
    void setDndDisabled(bool v);
    void setNow(DayOfWeek day, TimeOfDay time);

private:
    ILogger& m_logger;
    bool m_vaultInitialized = true;
    bool m_batterySafe = true;
    bool m_dndDisabled = true;
    DayOfWeek m_nowDay = DayOfWeek::Mon;
    TimeOfDay m_nowTime{12, 0};
};
