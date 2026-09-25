import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

// ESP8266 üçün növbədə olan əmr
let pendingCommand = null;

// ESP8266-dan gələn son hadisə
let lastEvent = null;

// Son zibil hadisəsi
let lastTrashEvent = null;


// ========================================
// TEST
// ========================================

app.get("/", (req, res) => {

    res.json({
        ok: true,
        service: "AI Smart Bin API",
        version: "1.0"
    });

});


// ========================================
// ESP8266 → COMMAND
// ========================================

app.get("/api/bin/command", (req, res) => {

    if (pendingCommand) {

        const command = pendingCommand;

        pendingCommand = null;

        console.log(
            "ESP8266 command:",
            command
        );

        return res.json({
            command: command
        });
    }

    res.json({
        command: null
    });

});


// ========================================
// ESP8266 → EVENT
// ========================================

app.get("/api/bin/event", (req, res) => {

    const event =
        req.query.event || "unknown";

    const distanceCm =
        Number(req.query.distanceCm || 0);

    lastEvent = {

        event: event,

        distanceCm: distanceCm,

        time: new Date().toISOString()

    };

    console.log(
        "ESP8266 EVENT:",
        lastEvent
    );


    if (
        event === "trash_on_floor"
    ) {

        lastTrashEvent = lastEvent;

    }


    res.json({

        ok: true,

        event: lastEvent

    });

});


// ========================================
// AI STUDIO → OPEN LID
// ========================================

app.get("/api/bin/open-lid", (req, res) => {

    console.log(
        "AI COMMAND: OPEN LID"
    );

    pendingCommand = "open_lid";

    res.json({

        ok: true,

        command: "open_lid"

    });

});


// ========================================
// STATUS
// ========================================

app.get("/api/bin/status", (req, res) => {

    res.json({

        ok: true,

        lastEvent: lastEvent,

        lastTrashEvent: lastTrashEvent,

        pendingCommand: pendingCommand

    });

});


// ========================================
// SERVER
// ========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `AI Smart Bin API running on port ${PORT}`
        );

    }
);
