exports('init', function()
    return {
        insert = function(...)
            return exports['az_postgresql']:insert(...)
        end,
        update = function(...)
            return exports['az_postgresql']:update(...)
        end,
        select = function(...)
            return exports['az_postgresql']:select(...)
        end,
        raw_query = function(...)
            return exports['az_postgresql']:raw_query(...)
        end,
        execute_file = function(...)
            return exports['az_postgresql']:execute_file(...)
        end,
        ready = function(cb) return exports['az_postgresql']:ready(cb) end,
        transaction = function(...)
            return exports['az_postgresql']:transaction(...)
        end
    }
end)
