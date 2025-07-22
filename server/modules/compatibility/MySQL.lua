MySQL = {Async = {}}

local function convertPlaceholders(query)
    local count = 0
    return query:gsub("?", function()
        count = count + 1
        return "$" .. count
    end)
end

local function convertQuotes(query) return query:gsub("`([^`]*)`", '"%1"') end

MySQL.ready = function(cb) return exports['az_postgresql']:ready(cb) end

MySQL.Async.insert = function(query, params, cb)
    local q = convertQuotes(query)
    q = convertPlaceholders(q)

    exports["az_postgresql"]:rawQuery(q, params or {}, function(success, result)
        if cb then
            if success and result and result[1] and
                (result[1].id or result[1].uuid) then
                cb(result[1].id or result[1].uuid)
            else
                cb(nil)
            end
        end
    end)
end

MySQL.insert = function(query, params)
    local p = promise.new()

    local q = convertQuotes(query)
    q = convertPlaceholders(q)

    MySQL.Async.insert(q, params, function(insertId) p:resolve(insertId) end)

    return Citizen.Await(p)
end

function MySQL.Async.execute(query, params, cb)
    local q = convertQuotes(query)
    q = convertPlaceholders(q)

    exports["az_postgresql"]:rawQuery(q, params, function(success, result)
        if cb then cb(success and result.rowCount or 0) end
    end)
end

function MySQL.Async.fetchAll(query, params, cb)
    local q = convertQuotes(query)
    q = convertPlaceholders(q)

    exports["az_postgresql"]:rawQuery(q, params, function(success, result)
        if cb then cb(success and result.rows or nil) end
    end)
end

function MySQL.Async.fetchScalar(query, params, cb)
    local q = convertQuotes(query)
    q = convertPlaceholders(q)

    exports["az_postgresql"]:rawQuery(q, params, function(success, result)
        if cb then
            if success and result.rows and result.rows[1] then
                local row = result.rows[1]
                for _, v in pairs(row) do
                    cb(v)
                    return
                end
            else
                cb(nil)
            end
        end
    end)
end
