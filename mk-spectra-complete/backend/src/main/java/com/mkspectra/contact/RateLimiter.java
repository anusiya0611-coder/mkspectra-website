package com.mkspectra.contact;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Tiny in-memory limiter: at most N requests per IP inside a time window. */
@Component
public class RateLimiter {

    private final int max;
    private final long windowMillis;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimiter(@Value("${app.ratelimit.max}") int max,
                       @Value("${app.ratelimit.window-minutes}") long windowMinutes) {
        this.max = max;
        this.windowMillis = windowMinutes * 60_000L;
    }

    public boolean allow(String key) {
        long now = System.currentTimeMillis();
        Deque<Long> q = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > windowMillis) q.pollFirst();
            if (q.size() >= max) return false;
            q.addLast(now);
        }
        if (hits.size() > 10_000) {   // keep memory bounded
            hits.entrySet().removeIf(e -> {
                synchronized (e.getValue()) {
                    return e.getValue().isEmpty() || now - e.getValue().peekLast() > windowMillis;
                }
            });
        }
        return true;
    }
}
