// main.cpp
// Desktop test harness for Chron core logic (scheduler + events).
// This lets you run/debug without Android or React Native.

#include <iostream>
#include <string>

// Your project headers (adjust paths if needed)
#include "logging/ILogger.hpp"
#include "platform/MockPlatform.hpp"
#include "events/MemoryEventStore.hpp"
#include "events/EventManager.hpp"
#include "call/CallController.hpp"
#include "scheduler/TriggerService.hpp"

// ------------------------------------------------------------
// A tiny helper to run scenarios cleanly
// ------------------------------------------------------------
static void runScenario(const std::string& name,
                        MockPlatform& platform,
                        TriggerService& trigger)
{
    std::cout << "\n=============================\n";
    std::cout << "Scenario: " << name << "\n";
    std::cout << "=============================\n";
    trigger.runTrigger();
}

int main()
{
    std::cout << "Chron Core Test Harness\n";

    // 1) Logging + Platform
    ConsoleLogger logger;          // If your logger is named differently, replace this
    MockPlatform platform(logger); // Must match your ctor

    // 2) Events
    MemoryEventStore store;                 // loads sample events
    EventManager eventManager(platform, logger, store);

    // 3) Call controller (implements ICallActions)
    CallController call(platform, logger);

    // 4) Trigger logic
    TriggerService trigger(platform, logger, eventManager, call);

    // ------------------------------------------------------------
    // SCENARIO 1: Not initialized -> skip
    // ------------------------------------------------------------
    platform.setVaultInitialized(false);  // add this setter in MockPlatform if you don't have it
    runScenario("Vault NOT initialized => skip", platform, trigger);

    // ------------------------------------------------------------
    // SCENARIO 2: Event active -> auto-log (bypass battery/DND)
    // ------------------------------------------------------------
    platform.setVaultInitialized(true);
    platform.setNow(DayOfWeek::Mon, TimeOfDay{18, 30}); // should match MemoryEventStore Study Block
    platform.setBatterySafe(false); // doesn't matter (bypassed)
    platform.setDndDisabled(false); // doesn't matter (bypassed)
    runScenario("Event ACTIVE => auto-log (bypass battery & DND)", platform, trigger);

    // ------------------------------------------------------------
    // SCENARIO 3: No event, battery low -> skip
    // ------------------------------------------------------------
    platform.setNow(DayOfWeek::Tue, TimeOfDay{12, 0}); // outside events
    platform.setBatterySafe(false);
    platform.setDndDisabled(true);
    runScenario("No event + battery LOW => skip", platform, trigger);

    // ------------------------------------------------------------
    // SCENARIO 4: No event, DND on -> skip
    // ------------------------------------------------------------
    platform.setBatterySafe(true);
    platform.setDndDisabled(false);
    runScenario("No event + DND ON => skip", platform, trigger);

    // ------------------------------------------------------------
    // SCENARIO 5: All good -> start call interaction
    // ------------------------------------------------------------
    platform.setBatterySafe(true);
    platform.setDndDisabled(true);
    runScenario("No event + battery OK + DND off => incoming call", platform, trigger);

    std::cout << "\nDone.\n";
    return 0;
}