Match
    method: ["*"],
    prefix: "/api"
    headers:
        Authorization: Bearer Token


match: 
    - method: ["*"],
strategy:
    - Rates([
        rate=0.1, StaticResponseStrategy,
        rate=0.2, StaticResponseStrategy,
        rate=0.7, ForwardRequestStrategy
    ])

match:
    - method: ["*"]
    - prefix: "/campaign/20000"
strategy:
    - Counter(
        fallback=ForwardRequestStrategy,
    ) [
        count '<=' 1, StaticResponseStrategy
    ]

match:
    - method: ["POST"]
    - prefix: "/accounts/12321"
strategy:
    - StaticResponseStrategy

match:
    - method: ["POST"]
    - prefix: "/users"
strategy:
    - FakerResponseStrategy