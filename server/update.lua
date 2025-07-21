-- https://github.com/overextended/oxmysql/blob/main/src/update/index.ts
CreateThread(function()
    if GetConvarInt("postgresql_versioncheck", 1) == 0 then return end

    local resourceName = GetCurrentResourceName()
    local versionString = GetResourceMetadata(resourceName, "version", 0)

    if not versionString then return end

    local currentVersion = {string.match(versionString, '(%d+)%.(%d+)%.(%d+)')}
    for i, v in ipairs(currentVersion) do currentVersion[i] = tonumber(v) end

    Wait(1000)

    PerformHttpRequest(
        "https://api.github.com/repos/azeroth/az_postgresql/releases/latest",
        function(status, body, headers)
            if status ~= 200 then
                print("^1Failed to retrieve latest version of postgresql (" ..
                          tostring(status) .. ")^0")
                return
            end

            local success, release = pcall(function()
                return json.decode(body)
            end)
            if not success or not release or release.prerelease then
                return
            end

            local latestVersion = {
                string.match(release.tag_name or "", '(%d+)%.(%d+)%.(%d+)')
            }
            for i, v in ipairs(latestVersion) do
                latestVersion[i] = tonumber(v)
            end

            if #latestVersion ~= 3 then return end

            for i = 1, 3 do
                local current = currentVersion[i]
                local latest = latestVersion[i]

                if current < latest then
                    print(
                        ("^3An update is available for %s (current version: %s)\r\n%s^0"):format(
                            resourceName, versionString, release.html_url or ""))
                    break
                elseif current > latest then
                    break
                end
            end
        end, "GET", "", {["User-Agent"] = "lua-fivem-version-checker"})
end)
