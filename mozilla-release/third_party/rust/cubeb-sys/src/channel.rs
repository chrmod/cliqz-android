// Copyright © 2017-2018 Mozilla Foundation
//
// This program is made available under an ISC-style license.  See the
// accompanying file LICENSE for details.

use std::os::raw::c_uint;

cubeb_enum! {
    pub enum cubeb_channel : c_uint {
        CHANNEL_UNKNOWN = 0,
        CHANNEL_FRONT_LEFT = 1 << 0,
        CHANNEL_FRONT_RIGHT = 1 << 1,
        CHANNEL_FRONT_CENTER = 1 << 2,
        CHANNEL_LOW_FREQUENCY = 1 << 3,
        CHANNEL_BACK_LEFT = 1 << 4,
        CHANNEL_BACK_RIGHT = 1 << 5,
        CHANNEL_FRONT_LEFT_OF_CENTER = 1 << 6,
        CHANNEL_FRONT_RIGHT_OF_CENTER = 1 << 7,
        CHANNEL_BACK_CENTER = 1 << 8,
        CHANNEL_SIDE_LEFT = 1 << 9,
        CHANNEL_SIDE_RIGHT = 1 << 10,
        CHANNEL_TOP_CENTER = 1 << 11,
        CHANNEL_TOP_FRONT_LEFT = 1 << 12,
        CHANNEL_TOP_FRONT_CENTER = 1 << 13,
        CHANNEL_TOP_FRONT_RIGHT = 1 << 14,
        CHANNEL_TOP_BACK_LEFT = 1 << 15,
        CHANNEL_TOP_BACK_CENTER = 1 << 16,
        CHANNEL_TOP_BACK_RIGHT = 1 << 17,
    }
}

cubeb_enum! {
    pub enum cubeb_channel_layout {
        CUBEB_LAYOUT_UNDEFINED = 0,
        CUBEB_LAYOUT_MONO = CHANNEL_FRONT_CENTER,
        CUBEB_LAYOUT_MONO_LFE = CUBEB_LAYOUT_MONO | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_STEREO = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT,
        CUBEB_LAYOUT_STEREO_LFE = CUBEB_LAYOUT_STEREO | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_3F = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                          CHANNEL_FRONT_CENTER,
        CUBEB_LAYOUT_3F_LFE = CUBEB_LAYOUT_3F | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_2F1 = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                           CHANNEL_BACK_CENTER,
        CUBEB_LAYOUT_2F1_LFE = CUBEB_LAYOUT_2F1 | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_3F1 = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                           CHANNEL_FRONT_CENTER | CHANNEL_BACK_CENTER,
        CUBEB_LAYOUT_3F1_LFE = CUBEB_LAYOUT_3F1 | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_2F2 = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                           CHANNEL_SIDE_LEFT | CHANNEL_SIDE_RIGHT,
        CUBEB_LAYOUT_2F2_LFE = CUBEB_LAYOUT_2F2 | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_QUAD = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                            CHANNEL_BACK_LEFT | CHANNEL_BACK_RIGHT,
        CUBEB_LAYOUT_QUAD_LFE = CUBEB_LAYOUT_QUAD | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_3F2 = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                           CHANNEL_FRONT_CENTER | CHANNEL_SIDE_LEFT |
                           CHANNEL_SIDE_RIGHT,
        CUBEB_LAYOUT_3F2_LFE = CUBEB_LAYOUT_3F2 | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_3F2_BACK = CUBEB_LAYOUT_QUAD | CHANNEL_FRONT_CENTER,
        CUBEB_LAYOUT_3F2_LFE_BACK = CUBEB_LAYOUT_3F2_BACK | CHANNEL_LOW_FREQUENCY,
        CUBEB_LAYOUT_3F3R_LFE = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                                CHANNEL_FRONT_CENTER | CHANNEL_LOW_FREQUENCY |
                                CHANNEL_BACK_CENTER | CHANNEL_SIDE_LEFT |
                                CHANNEL_SIDE_RIGHT,
        CUBEB_LAYOUT_3F4_LFE = CHANNEL_FRONT_LEFT | CHANNEL_FRONT_RIGHT |
                               CHANNEL_FRONT_CENTER | CHANNEL_LOW_FREQUENCY |
                               CHANNEL_BACK_LEFT | CHANNEL_BACK_RIGHT |
                               CHANNEL_SIDE_LEFT | CHANNEL_SIDE_RIGHT,
    }
}
