export interface Icon {
    readonly long: number;
    readonly transform: [number, number];
    readonly d: string;
}

export const action: { run: Icon; add: Icon; config: Icon } = {
    run: {
        long: 1580,
        transform: [86, 100],
        d: 'M1384 609l-1328 -738q-23 -13 -39.5 -3t-16.5 36v1472q0 26 16.5 36t39.5 -3l1328 -738q23 -13 23 -31t-23 -31z',
    },
    add: {
        long: 1408,
        transform: [0, 0],
        d: 'M1408 800v-192q0 -40 -28 -68t-68 -28h-416v-416q0 -40 -28 -68t-68 -28h-192q-40 0 -68 28t-28 68v416h-416q-40 0 -68 28t-28 68v192q0 40 28 68t68 28h416v416q0 40 28 68t68 28h192q40 0 68 -28t28 -68v-416h416q40 0 68 -28t28 -68z',
    },
    config: {
        long: 1920,
        transform: [-30, 200],
        d: 'M896 640q0 106 -75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75t181 75t75 181zM1664 128q0 52 -38 90t-90 38t-90 -38t-38 -90q0 -53 37.5 -90.5t90.5 -37.5t90.5 37.5t37.5 90.5zM1664 1152q0 52 -38 90t-90 38t-90 -38t-38 -90q0 -53 37.5 -90.5t90.5 -37.5 t90.5 37.5t37.5 90.5zM1280 731v-185q0 -10 -7 -19.5t-16 -10.5l-155 -24q-11 -35 -32 -76q34 -48 90 -115q7 -10 7 -20q0 -12 -7 -19q-23 -30 -82.5 -89.5t-78.5 -59.5q-11 0 -21 7l-115 90q-37 -19 -77 -31q-11 -108 -23 -155q-7 -24 -30 -24h-186q-11 0 -20 7.5t-10 17.5 l-23 153q-34 10 -75 31l-118 -89q-7 -7 -20 -7q-11 0 -21 8q-144 133 -144 160q0 9 7 19q10 14 41 53t47 61q-23 44 -35 82l-152 24q-10 1 -17 9.5t-7 19.5v185q0 10 7 19.5t16 10.5l155 24q11 35 32 76q-34 48 -90 115q-7 11 -7 20q0 12 7 20q22 30 82 89t79 59q11 0 21 -7 l115 -90q34 18 77 32q11 108 23 154q7 24 30 24h186q11 0 20 -7.5t10 -17.5l23 -153q34 -10 75 -31l118 89q8 7 20 7q11 0 21 -8q144 -133 144 -160q0 -9 -7 -19q-12 -16 -42 -54t-45 -60q23 -48 34 -82l152 -23q10 -2 17 -10.5t7 -19.5zM1920 198v-140q0 -16 -149 -31 q-12 -27 -30 -52q51 -113 51 -138q0 -4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68q-20 -2 -30 -2t-30 2q-14 -21 -52 -68t-46 -47q-2 0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 31v140q0 16 149 31q13 29 30 52q-51 113 -51 138q0 4 4 7q4 2 35 20 t59 34t30 16q8 0 46 -46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 0 124 -70q4 -3 4 -7q0 -25 -51 -138q17 -23 30 -52q149 -15 149 -31zM1920 1222v-140q0 -16 -149 -31q-12 -27 -30 -52q51 -113 51 -138q0 -4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68 q-20 -2 -30 -2t-30 2q-14 -21 -52 -68t-46 -47q-2 0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 31v140q0 16 149 31q13 29 30 52q-51 113 -51 138q0 4 4 7q4 2 35 20t59 34t30 16q8 0 46 -46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 0 124 -70 q4 -3 4 -7q0 -25 -51 -138q17 -23 30 -52q149 -15 149 -31z',
    },
};
