#pragma once
#include "logging/ILogger.hpp"
#include <iostream>

class ConsoleLogger : public ILogger
{
public:
    void info(const std::string& message) override
    {
        std::cout << "[INFO] " << message << '\n';
    }

    void warn(const std::string& message) override
    {
        std::cout << "[WARN] " << message << '\n';
    }

    void error(const std::string& message) override
    {
        std::cerr << "[ERROR] " << message << '\n';
    }
};
