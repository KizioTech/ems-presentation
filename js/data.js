const CY_NODES = [
  {
    "data": {
      "id": "1",
      "label": "Dispatch_A",
      "node_type": "hospital",
      "zone": "CBD",
      "has_incident": false,
      "is_base": true
    },
    "position": {
      "x": 150.0,
      "y": 150.0
    }
  },
  {
    "data": {
      "id": "2",
      "label": "Dispatch_B",
      "node_type": "hospital",
      "zone": "residential",
      "has_incident": true,
      "is_base": true
    },
    "position": {
      "x": 600.0,
      "y": 525.0
    }
  },
  {
    "data": {
      "id": "3",
      "label": "Dispatch_C",
      "node_type": "hospital",
      "zone": "residential",
      "has_incident": false,
      "is_base": true
    },
    "position": {
      "x": 225.0,
      "y": 600.0
    }
  },
  {
    "data": {
      "id": "4",
      "label": "Market_1",
      "node_type": "market",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 370.22627228388046,
      "y": 271.74106754814073
    }
  },
  {
    "data": {
      "id": "5",
      "label": "Market_2",
      "node_type": "market",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 437.24886408963846,
      "y": 337.75153421305566
    }
  },
  {
    "data": {
      "id": "6",
      "label": "Market_3",
      "node_type": "market",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 329.2534950829568,
      "y": 420.751027436962
    }
  },
  {
    "data": {
      "id": "7",
      "label": "Market_4",
      "node_type": "market",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 310.89067728153736,
      "y": 287.5919726671997
    }
  },
  {
    "data": {
      "id": "8",
      "label": "Node_8",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 443.25263292666597,
      "y": 234.55100998766932
    }
  },
  {
    "data": {
      "id": "9",
      "label": "Node_9",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 51.39453364966665,
      "y": 57.810849790653805
    }
  },
  {
    "data": {
      "id": "10",
      "label": "Node_10",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 599.3987825402847,
      "y": 569.1711002921636
    }
  },
  {
    "data": {
      "id": "11",
      "label": "Node_11",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 160.23185286479293,
      "y": 588.7019558489322
    }
  },
  {
    "data": {
      "id": "12",
      "label": "Node_12",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 242.86351399768796,
      "y": 358.2894086482395
    }
  },
  {
    "data": {
      "id": "13",
      "label": "Node_13",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 329.0628875834281,
      "y": 515.9203303663217
    }
  },
  {
    "data": {
      "id": "14",
      "label": "Node_14",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 450.50070393760615,
      "y": 618.3416440598717
    }
  },
  {
    "data": {
      "id": "15",
      "label": "Node_15",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 234.69763776127223,
      "y": 465.20575577675805
    }
  },
  {
    "data": {
      "id": "16",
      "label": "Node_16",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 345.3472393464993,
      "y": 182.5062260597158
    }
  },
  {
    "data": {
      "id": "17",
      "label": "Node_17",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 172.2798029568928,
      "y": 365.39175407081217
    }
  },
  {
    "data": {
      "id": "18",
      "label": "Node_18",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 437.3798339818787,
      "y": 681.1459714140016
    }
  },
  {
    "data": {
      "id": "19",
      "label": "Node_19",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 447.5927750334709,
      "y": 597.3962165110783
    }
  },
  {
    "data": {
      "id": "20",
      "label": "Node_20",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 81.40982526506367,
      "y": 72.00226235400007
    }
  },
  {
    "data": {
      "id": "21",
      "label": "Node_21",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 689.3016223253276,
      "y": 166.8317900213887
    }
  },
  {
    "data": {
      "id": "22",
      "label": "Node_22",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 243.1142941920252,
      "y": 646.5713230456909
    }
  },
  {
    "data": {
      "id": "23",
      "label": "Node_23",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 499.3572928957059,
      "y": 415.3970667257691
    }
  },
  {
    "data": {
      "id": "24",
      "label": "Node_24",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 119.8758085202257,
      "y": 378.2555856748926
    }
  },
  {
    "data": {
      "id": "25",
      "label": "Node_25",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 60.71225175277242,
      "y": 98.70872859682206
    }
  },
  {
    "data": {
      "id": "26",
      "label": "Node_26",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 212.1764875800114,
      "y": 265.2974580610622
    }
  },
  {
    "data": {
      "id": "27",
      "label": "Node_27",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 247.9049763603524,
      "y": 361.45408570497773
    }
  },
  {
    "data": {
      "id": "28",
      "label": "Node_28",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 406.5294385567138,
      "y": 587.7232425202692
    }
  },
  {
    "data": {
      "id": "29",
      "label": "Node_29",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 691.9696237410769,
      "y": 189.28534423124768
    }
  },
  {
    "data": {
      "id": "30",
      "label": "Node_30",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 671.6617855558277,
      "y": 108.4915384613371
    }
  },
  {
    "data": {
      "id": "31",
      "label": "Node_31",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 441.08248569748247,
      "y": 90.23489135939617
    }
  },
  {
    "data": {
      "id": "32",
      "label": "Node_32",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 97.23243888504567,
      "y": 580.211567867077
    }
  },
  {
    "data": {
      "id": "33",
      "label": "Node_33",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 68.02842001461319,
      "y": 492.9020267347966
    }
  },
  {
    "data": {
      "id": "34",
      "label": "Node_34",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 299.8571705404004,
      "y": 529.3394035526203
    }
  },
  {
    "data": {
      "id": "35",
      "label": "Node_35",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 596.8978186775523,
      "y": 471.6915044818272
    }
  },
  {
    "data": {
      "id": "36",
      "label": "Node_36",
      "node_type": "intersection",
      "zone": "CBD",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 227.130794038982,
      "y": 346.18014386818226
    }
  },
  {
    "data": {
      "id": "37",
      "label": "Node_37",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": true,
      "is_base": false
    },
    "position": {
      "x": 132.62385185796478,
      "y": 171.0170379910232
    }
  },
  {
    "data": {
      "id": "38",
      "label": "Node_38",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 87.8216844838453,
      "y": 46.351317794650896
    }
  },
  {
    "data": {
      "id": "39",
      "label": "Node_39",
      "node_type": "intersection",
      "zone": "residential",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 558.7652192752438,
      "y": 578.3669149644336
    }
  },
  {
    "data": {
      "id": "40",
      "label": "Node_40",
      "node_type": "intersection",
      "zone": "peri-urban",
      "has_incident": false,
      "is_base": false
    },
    "position": {
      "x": 41.22742905843162,
      "y": 162.06353579298693
    }
  }
];
const CY_EDGES = [
  {
    "data": {
      "id": "e1",
      "source": "1",
      "target": "37",
      "edge_id": 1,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.379,
      "base_time": 0.86,
      "is_market_road": false,
      "criticality": 0.3036,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 258.13
    }
  },
  {
    "data": {
      "id": "e2",
      "source": "1",
      "target": "25",
      "edge_id": 2,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.601,
      "base_time": 3.73,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1098.53
    }
  },
  {
    "data": {
      "id": "e3",
      "source": "1",
      "target": "20",
      "edge_id": 3,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.161,
      "base_time": 2.81,
      "is_market_road": false,
      "criticality": 0.3155,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 805.38
    }
  },
  {
    "data": {
      "id": "e4",
      "source": "1",
      "target": "40",
      "edge_id": 4,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.556,
      "base_time": 3.61,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1066.39
    }
  },
  {
    "data": {
      "id": "e5",
      "source": "2",
      "target": "10",
      "edge_id": 5,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.499,
      "base_time": 1.21,
      "is_market_road": false,
      "criticality": 0.0119,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 346.34
    }
  },
  {
    "data": {
      "id": "e6",
      "source": "2",
      "target": "35",
      "edge_id": 6,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.729,
      "base_time": 1.66,
      "is_market_road": false,
      "criticality": 0.0476,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 497.0
    }
  },
  {
    "data": {
      "id": "e7",
      "source": "2",
      "target": "39",
      "edge_id": 7,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.907,
      "base_time": 2.18,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 627.91
    }
  },
  {
    "data": {
      "id": "e8",
      "source": "2",
      "target": "23",
      "edge_id": 8,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.673,
      "base_time": 4.44,
      "is_market_road": false,
      "criticality": 0.125,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1193.12
    }
  },
  {
    "data": {
      "id": "e9",
      "source": "2",
      "target": "19",
      "edge_id": 9,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.083,
      "base_time": 3.04,
      "is_market_road": false,
      "criticality": 0.0774,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1278.17
    }
  },
  {
    "data": {
      "id": "e10",
      "source": "3",
      "target": "22",
      "edge_id": 10,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.677,
      "base_time": 0.99,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 415.58
    }
  },
  {
    "data": {
      "id": "e11",
      "source": "3",
      "target": "11",
      "edge_id": 11,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.911,
      "base_time": 1.26,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 553.21
    }
  },
  {
    "data": {
      "id": "e12",
      "source": "3",
      "target": "34",
      "edge_id": 12,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.441,
      "base_time": 3.21,
      "is_market_road": false,
      "criticality": 0.1161,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 976.47
    }
  },
  {
    "data": {
      "id": "e13",
      "source": "3",
      "target": "32",
      "edge_id": 13,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.694,
      "base_time": 2.76,
      "is_market_road": false,
      "criticality": 0.0446,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1063.45
    }
  },
  {
    "data": {
      "id": "e14",
      "source": "3",
      "target": "13",
      "edge_id": 14,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.057,
      "base_time": 3.14,
      "is_market_road": false,
      "criticality": 0.2024,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1273.71
    }
  },
  {
    "data": {
      "id": "e15",
      "source": "4",
      "target": "7",
      "edge_id": 15,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.952,
      "base_time": 1.47,
      "is_market_road": true,
      "criticality": 0.0298,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 590.88
    }
  },
  {
    "data": {
      "id": "e16",
      "source": "4",
      "target": "8",
      "edge_id": 16,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.874,
      "base_time": 1.27,
      "is_market_road": true,
      "criticality": 0.0833,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 535.84
    }
  },
  {
    "data": {
      "id": "e17",
      "source": "4",
      "target": "16",
      "edge_id": 17,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.069,
      "base_time": 2.67,
      "is_market_road": true,
      "criticality": 0.4167,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 748.45
    }
  },
  {
    "data": {
      "id": "e18",
      "source": "4",
      "target": "5",
      "edge_id": 18,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.351,
      "base_time": 3.25,
      "is_market_road": true,
      "criticality": 0.4821,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 935.53
    }
  },
  {
    "data": {
      "id": "e19",
      "source": "4",
      "target": "27",
      "edge_id": 19,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.754,
      "base_time": 2.77,
      "is_market_road": true,
      "criticality": 0.0833,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 1093.8
    }
  },
  {
    "data": {
      "id": "e20",
      "source": "5",
      "target": "4",
      "edge_id": 20,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.131,
      "base_time": 2.97,
      "is_market_road": true,
      "criticality": 0.0506,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 803.95
    }
  },
  {
    "data": {
      "id": "e21",
      "source": "5",
      "target": "23",
      "edge_id": 21,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.438,
      "base_time": 2.08,
      "is_market_road": true,
      "criticality": 0.7292,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 880.83
    }
  },
  {
    "data": {
      "id": "e22",
      "source": "5",
      "target": "8",
      "edge_id": 22,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.25,
      "base_time": 1.7,
      "is_market_road": true,
      "criticality": 0.1161,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 756.67
    }
  },
  {
    "data": {
      "id": "e23",
      "source": "5",
      "target": "7",
      "edge_id": 23,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.474,
      "base_time": 3.6,
      "is_market_road": true,
      "criticality": 0.1518,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1025.21
    }
  },
  {
    "data": {
      "id": "e24",
      "source": "6",
      "target": "13",
      "edge_id": 24,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.285,
      "base_time": 2.98,
      "is_market_road": true,
      "criticality": 0.1607,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 880.55
    }
  },
  {
    "data": {
      "id": "e25",
      "source": "6",
      "target": "27",
      "edge_id": 25,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.392,
      "base_time": 3.31,
      "is_market_road": true,
      "criticality": 0.1012,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 960.7
    }
  },
  {
    "data": {
      "id": "e26",
      "source": "6",
      "target": "15",
      "edge_id": 26,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.249,
      "base_time": 1.92,
      "is_market_road": true,
      "criticality": 0.0298,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 774.51
    }
  },
  {
    "data": {
      "id": "e27",
      "source": "6",
      "target": "12",
      "edge_id": 27,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.696,
      "base_time": 4.1,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1176.1
    }
  },
  {
    "data": {
      "id": "e28",
      "source": "7",
      "target": "4",
      "edge_id": 28,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.929,
      "base_time": 2.43,
      "is_market_road": true,
      "criticality": 1.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 659.57
    }
  },
  {
    "data": {
      "id": "e29",
      "source": "7",
      "target": "27",
      "edge_id": 29,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.057,
      "base_time": 2.71,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 745.88
    }
  },
  {
    "data": {
      "id": "e30",
      "source": "7",
      "target": "12",
      "edge_id": 30,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.055,
      "base_time": 2.45,
      "is_market_road": true,
      "criticality": 0.0119,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 723.23
    }
  },
  {
    "data": {
      "id": "e31",
      "source": "7",
      "target": "26",
      "edge_id": 31,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.428,
      "base_time": 3.62,
      "is_market_road": true,
      "criticality": 0.119,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1004.24
    }
  },
  {
    "data": {
      "id": "e32",
      "source": "7",
      "target": "36",
      "edge_id": 32,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.301,
      "base_time": 1.88,
      "is_market_road": true,
      "criticality": 0.1518,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 796.76
    }
  },
  {
    "data": {
      "id": "e33",
      "source": "8",
      "target": "4",
      "edge_id": 33,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.195,
      "base_time": 2.77,
      "is_market_road": true,
      "criticality": 0.0298,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 818.77
    }
  },
  {
    "data": {
      "id": "e34",
      "source": "8",
      "target": "5",
      "edge_id": 34,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.486,
      "base_time": 2.21,
      "is_market_road": true,
      "criticality": 0.0476,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 915.28
    }
  },
  {
    "data": {
      "id": "e35",
      "source": "8",
      "target": "16",
      "edge_id": 35,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.764,
      "base_time": 2.83,
      "is_market_road": false,
      "criticality": 0.0446,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1103.72
    }
  },
  {
    "data": {
      "id": "e36",
      "source": "8",
      "target": "7",
      "edge_id": 36,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.279,
      "base_time": 5.74,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1599.6
    }
  },
  {
    "data": {
      "id": "e37",
      "source": "8",
      "target": "31",
      "edge_id": 37,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.219,
      "base_time": 5.26,
      "is_market_road": false,
      "criticality": 0.0833,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1530.08
    }
  },
  {
    "data": {
      "id": "e38",
      "source": "9",
      "target": "20",
      "edge_id": 38,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.483,
      "base_time": 1.19,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 336.8
    }
  },
  {
    "data": {
      "id": "e39",
      "source": "9",
      "target": "38",
      "edge_id": 39,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.566,
      "base_time": 1.26,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 383.47
    }
  },
  {
    "data": {
      "id": "e40",
      "source": "9",
      "target": "25",
      "edge_id": 40,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.484,
      "base_time": 1.27,
      "is_market_road": false,
      "criticality": 0.006,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 343.96
    }
  },
  {
    "data": {
      "id": "e41",
      "source": "9",
      "target": "40",
      "edge_id": 41,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.122,
      "base_time": 2.64,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 772.02
    }
  },
  {
    "data": {
      "id": "e42",
      "source": "9",
      "target": "1",
      "edge_id": 42,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.444,
      "base_time": 2.1,
      "is_market_road": false,
      "criticality": 0.1042,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 885.45
    }
  },
  {
    "data": {
      "id": "e43",
      "source": "9",
      "target": "37",
      "edge_id": 43,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.0,
      "base_time": 2.97,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1231.5
    }
  },
  {
    "data": {
      "id": "e44",
      "source": "10",
      "target": "39",
      "edge_id": 44,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.497,
      "base_time": 0.72,
      "is_market_road": false,
      "criticality": 0.0119,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 304.52
    }
  },
  {
    "data": {
      "id": "e45",
      "source": "10",
      "target": "2",
      "edge_id": 45,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.624,
      "base_time": 1.43,
      "is_market_road": false,
      "criticality": 0.1369,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 426.17
    }
  },
  {
    "data": {
      "id": "e46",
      "source": "10",
      "target": "35",
      "edge_id": 46,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.336,
      "base_time": 3.11,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 916.48
    }
  },
  {
    "data": {
      "id": "e47",
      "source": "10",
      "target": "19",
      "edge_id": 47,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.865,
      "base_time": 2.87,
      "is_market_road": false,
      "criticality": 0.256,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1156.75
    }
  },
  {
    "data": {
      "id": "e48",
      "source": "11",
      "target": "32",
      "edge_id": 48,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.843,
      "base_time": 1.85,
      "is_market_road": false,
      "criticality": 0.006,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 568.92
    }
  },
  {
    "data": {
      "id": "e49",
      "source": "11",
      "target": "3",
      "edge_id": 49,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.824,
      "base_time": 2.0,
      "is_market_road": false,
      "criticality": 0.2976,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 572.07
    }
  },
  {
    "data": {
      "id": "e50",
      "source": "11",
      "target": "22",
      "edge_id": 50,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.544,
      "base_time": 3.58,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1057.98
    }
  },
  {
    "data": {
      "id": "e51",
      "source": "11",
      "target": "33",
      "edge_id": 51,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.824,
      "base_time": 2.74,
      "is_market_road": false,
      "criticality": 0.125,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1125.74
    }
  },
  {
    "data": {
      "id": "e52",
      "source": "11",
      "target": "15",
      "edge_id": 52,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.303,
      "base_time": 6.08,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1639.74
    }
  },
  {
    "data": {
      "id": "e53",
      "source": "12",
      "target": "27",
      "edge_id": 53,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.075,
      "base_time": 0.17,
      "is_market_road": true,
      "criticality": 0.0625,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 51.07
    }
  },
  {
    "data": {
      "id": "e54",
      "source": "12",
      "target": "36",
      "edge_id": 54,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.257,
      "base_time": 0.36,
      "is_market_road": true,
      "criticality": 0.8274,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 156.44
    }
  },
  {
    "data": {
      "id": "e55",
      "source": "12",
      "target": "17",
      "edge_id": 55,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.079,
      "base_time": 2.37,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 728.37
    }
  },
  {
    "data": {
      "id": "e56",
      "source": "12",
      "target": "26",
      "edge_id": 56,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.489,
      "base_time": 2.29,
      "is_market_road": false,
      "criticality": 0.4762,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 923.42
    }
  },
  {
    "data": {
      "id": "e57",
      "source": "12",
      "target": "7",
      "edge_id": 57,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.338,
      "base_time": 3.44,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 944.96
    }
  },
  {
    "data": {
      "id": "e58",
      "source": "13",
      "target": "34",
      "edge_id": 58,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.355,
      "base_time": 0.78,
      "is_market_road": true,
      "criticality": 0.7083,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 239.66
    }
  },
  {
    "data": {
      "id": "e59",
      "source": "13",
      "target": "6",
      "edge_id": 59,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.197,
      "base_time": 1.74,
      "is_market_road": true,
      "criticality": 0.0625,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 733.92
    }
  },
  {
    "data": {
      "id": "e60",
      "source": "13",
      "target": "28",
      "edge_id": 60,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.308,
      "base_time": 2.05,
      "is_market_road": false,
      "criticality": 0.0833,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 814.37
    }
  },
  {
    "data": {
      "id": "e61",
      "source": "13",
      "target": "15",
      "edge_id": 61,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.548,
      "base_time": 4.01,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1095.78
    }
  },
  {
    "data": {
      "id": "e62",
      "source": "13",
      "target": "3",
      "edge_id": 62,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.727,
      "base_time": 4.32,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1209.68
    }
  },
  {
    "data": {
      "id": "e63",
      "source": "13",
      "target": "19",
      "edge_id": 63,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.597,
      "base_time": 2.34,
      "is_market_road": false,
      "criticality": 0.1875,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 980.72
    }
  },
  {
    "data": {
      "id": "e64",
      "source": "14",
      "target": "19",
      "edge_id": 64,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.299,
      "base_time": 0.68,
      "is_market_road": false,
      "criticality": 0.0923,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 203.77
    }
  },
  {
    "data": {
      "id": "e65",
      "source": "14",
      "target": "28",
      "edge_id": 65,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.826,
      "base_time": 1.87,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 562.23
    }
  },
  {
    "data": {
      "id": "e66",
      "source": "14",
      "target": "18",
      "edge_id": 66,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.717,
      "base_time": 1.76,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 499.43
    }
  },
  {
    "data": {
      "id": "e67",
      "source": "14",
      "target": "39",
      "edge_id": 67,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.518,
      "base_time": 4.01,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1081.02
    }
  },
  {
    "data": {
      "id": "e68",
      "source": "14",
      "target": "10",
      "edge_id": 68,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.167,
      "base_time": 3.4,
      "is_market_road": false,
      "criticality": 0.0149,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1349.5
    }
  },
  {
    "data": {
      "id": "e69",
      "source": "14",
      "target": "13",
      "edge_id": 69,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.391,
      "base_time": 3.95,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1505.54
    }
  },
  {
    "data": {
      "id": "e70",
      "source": "15",
      "target": "34",
      "edge_id": 70,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.379,
      "base_time": 3.43,
      "is_market_road": true,
      "criticality": 0.0179,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 964.3
    }
  },
  {
    "data": {
      "id": "e71",
      "source": "15",
      "target": "6",
      "edge_id": 71,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.369,
      "base_time": 1.88,
      "is_market_road": true,
      "criticality": 0.0238,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 830.21
    }
  },
  {
    "data": {
      "id": "e72",
      "source": "15",
      "target": "27",
      "edge_id": 72,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.345,
      "base_time": 3.44,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 948.41
    }
  },
  {
    "data": {
      "id": "e73",
      "source": "15",
      "target": "13",
      "edge_id": 73,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.219,
      "base_time": 3.15,
      "is_market_road": true,
      "criticality": 0.0268,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 862.25
    }
  },
  {
    "data": {
      "id": "e74",
      "source": "15",
      "target": "12",
      "edge_id": 74,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.167,
      "base_time": 2.69,
      "is_market_road": true,
      "criticality": 0.6667,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 798.33
    }
  },
  {
    "data": {
      "id": "e75",
      "source": "16",
      "target": "4",
      "edge_id": 75,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.112,
      "base_time": 2.54,
      "is_market_road": true,
      "criticality": 0.006,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 758.77
    }
  },
  {
    "data": {
      "id": "e76",
      "source": "16",
      "target": "7",
      "edge_id": 76,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.432,
      "base_time": 2.34,
      "is_market_road": true,
      "criticality": 0.0714,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 899.54
    }
  },
  {
    "data": {
      "id": "e77",
      "source": "16",
      "target": "8",
      "edge_id": 77,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.724,
      "base_time": 4.54,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1226.54
    }
  },
  {
    "data": {
      "id": "e78",
      "source": "16",
      "target": "31",
      "edge_id": 78,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.485,
      "base_time": 3.76,
      "is_market_road": false,
      "criticality": 0.3452,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1043.95
    }
  },
  {
    "data": {
      "id": "e79",
      "source": "16",
      "target": "26",
      "edge_id": 79,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.206,
      "base_time": 3.04,
      "is_market_road": false,
      "criticality": 0.1429,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1338.69
    }
  },
  {
    "data": {
      "id": "e80",
      "source": "16",
      "target": "5",
      "edge_id": 80,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.344,
      "base_time": 3.41,
      "is_market_road": true,
      "criticality": 0.0417,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 1437.41
    }
  },
  {
    "data": {
      "id": "e81",
      "source": "17",
      "target": "24",
      "edge_id": 81,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.678,
      "base_time": 1.71,
      "is_market_road": false,
      "criticality": 0.0417,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 476.08
    }
  },
  {
    "data": {
      "id": "e82",
      "source": "17",
      "target": "36",
      "edge_id": 82,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.656,
      "base_time": 1.74,
      "is_market_road": false,
      "criticality": 0.1845,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 467.75
    }
  },
  {
    "data": {
      "id": "e83",
      "source": "17",
      "target": "12",
      "edge_id": 83,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.08,
      "base_time": 1.78,
      "is_market_road": false,
      "criticality": 0.1488,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 679.69
    }
  },
  {
    "data": {
      "id": "e84",
      "source": "17",
      "target": "27",
      "edge_id": 84,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.847,
      "base_time": 2.04,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 586.72
    }
  },
  {
    "data": {
      "id": "e85",
      "source": "18",
      "target": "14",
      "edge_id": 85,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.833,
      "base_time": 2.14,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 588.17
    }
  },
  {
    "data": {
      "id": "e86",
      "source": "18",
      "target": "19",
      "edge_id": 86,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.186,
      "base_time": 2.78,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 815.18
    }
  },
  {
    "data": {
      "id": "e87",
      "source": "18",
      "target": "28",
      "edge_id": 87,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.378,
      "base_time": 2.12,
      "is_market_road": false,
      "criticality": 0.0893,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 854.64
    }
  },
  {
    "data": {
      "id": "e88",
      "source": "18",
      "target": "39",
      "edge_id": 88,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.255,
      "base_time": 3.16,
      "is_market_road": false,
      "criticality": 0.0208,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1372.79
    }
  },
  {
    "data": {
      "id": "e89",
      "source": "19",
      "target": "14",
      "edge_id": 89,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.297,
      "base_time": 0.66,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 201.12
    }
  },
  {
    "data": {
      "id": "e90",
      "source": "19",
      "target": "28",
      "edge_id": 90,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.579,
      "base_time": 1.34,
      "is_market_road": false,
      "criticality": 0.0089,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 396.53
    }
  },
  {
    "data": {
      "id": "e91",
      "source": "19",
      "target": "18",
      "edge_id": 91,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.269,
      "base_time": 1.79,
      "is_market_road": false,
      "criticality": 0.0655,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 773.51
    }
  },
  {
    "data": {
      "id": "e92",
      "source": "19",
      "target": "39",
      "edge_id": 92,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.595,
      "base_time": 3.6,
      "is_market_road": false,
      "criticality": 0.0327,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1084.74
    }
  },
  {
    "data": {
      "id": "e93",
      "source": "19",
      "target": "13",
      "edge_id": 93,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.699,
      "base_time": 2.67,
      "is_market_road": false,
      "criticality": 0.3452,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1058.41
    }
  },
  {
    "data": {
      "id": "e94",
      "source": "19",
      "target": "10",
      "edge_id": 94,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.156,
      "base_time": 3.56,
      "is_market_road": false,
      "criticality": 0.125,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1357.42
    }
  },
  {
    "data": {
      "id": "e95",
      "source": "20",
      "target": "38",
      "edge_id": 95,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.401,
      "base_time": 0.62,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 248.96
    }
  },
  {
    "data": {
      "id": "e96",
      "source": "20",
      "target": "9",
      "edge_id": 96,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.404,
      "base_time": 0.57,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 246.27
    }
  },
  {
    "data": {
      "id": "e97",
      "source": "20",
      "target": "25",
      "edge_id": 97,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.474,
      "base_time": 0.68,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 289.87
    }
  },
  {
    "data": {
      "id": "e98",
      "source": "20",
      "target": "40",
      "edge_id": 98,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.475,
      "base_time": 3.38,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1007.37
    }
  },
  {
    "data": {
      "id": "e99",
      "source": "20",
      "target": "1",
      "edge_id": 99,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.524,
      "base_time": 2.44,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 953.14
    }
  },
  {
    "data": {
      "id": "e100",
      "source": "20",
      "target": "37",
      "edge_id": 100,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.434,
      "base_time": 3.13,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 966.36
    }
  },
  {
    "data": {
      "id": "e101",
      "source": "21",
      "target": "29",
      "edge_id": 101,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.346,
      "base_time": 0.51,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 212.73
    }
  },
  {
    "data": {
      "id": "e102",
      "source": "21",
      "target": "30",
      "edge_id": 102,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.871,
      "base_time": 2.21,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 612.7
    }
  },
  {
    "data": {
      "id": "e103",
      "source": "21",
      "target": "8",
      "edge_id": 103,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 3.236,
      "base_time": 8.2,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 2275.45
    }
  },
  {
    "data": {
      "id": "e104",
      "source": "21",
      "target": "31",
      "edge_id": 104,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 3.311,
      "base_time": 4.97,
      "is_market_road": false,
      "criticality": 0.0595,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 2043.18
    }
  },
  {
    "data": {
      "id": "e105",
      "source": "21",
      "target": "5",
      "edge_id": 105,
      "road_type": "trunk",
      "lanes": 4,
      "length_km": 3.335,
      "base_time": 3.63,
      "is_market_road": true,
      "criticality": 0.2202,
      "gamma": 0.225,
      "rel_class": "medium",
      "total_cost": 1943.32
    }
  },
  {
    "data": {
      "id": "e106",
      "source": "22",
      "target": "3",
      "edge_id": 106,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.618,
      "base_time": 1.62,
      "is_market_road": false,
      "criticality": 0.0179,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 439.06
    }
  },
  {
    "data": {
      "id": "e107",
      "source": "22",
      "target": "11",
      "edge_id": 107,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.387,
      "base_time": 3.05,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 936.57
    }
  },
  {
    "data": {
      "id": "e108",
      "source": "22",
      "target": "34",
      "edge_id": 108,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.593,
      "base_time": 3.86,
      "is_market_road": false,
      "criticality": 0.0655,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1105.42
    }
  },
  {
    "data": {
      "id": "e109",
      "source": "22",
      "target": "13",
      "edge_id": 109,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.296,
      "base_time": 3.33,
      "is_market_road": false,
      "criticality": 0.0327,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1407.13
    }
  },
  {
    "data": {
      "id": "e110",
      "source": "23",
      "target": "5",
      "edge_id": 110,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.554,
      "base_time": 4.04,
      "is_market_road": true,
      "criticality": 0.2083,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1101.23
    }
  },
  {
    "data": {
      "id": "e111",
      "source": "23",
      "target": "35",
      "edge_id": 111,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.235,
      "base_time": 2.7,
      "is_market_road": false,
      "criticality": 0.1369,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 832.62
    }
  },
  {
    "data": {
      "id": "e112",
      "source": "23",
      "target": "2",
      "edge_id": 112,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.147,
      "base_time": 5.11,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1482.16
    }
  },
  {
    "data": {
      "id": "e113",
      "source": "23",
      "target": "6",
      "edge_id": 113,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.575,
      "base_time": 5.96,
      "is_market_road": true,
      "criticality": 0.2024,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1763.57
    }
  },
  {
    "data": {
      "id": "e114",
      "source": "23",
      "target": "39",
      "edge_id": 114,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.244,
      "base_time": 5.05,
      "is_market_road": false,
      "criticality": 0.122,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1524.88
    }
  },
  {
    "data": {
      "id": "e115",
      "source": "23",
      "target": "10",
      "edge_id": 115,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.829,
      "base_time": 4.33,
      "is_market_road": false,
      "criticality": 0.247,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1752.7
    }
  },
  {
    "data": {
      "id": "e116",
      "source": "24",
      "target": "17",
      "edge_id": 116,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.86,
      "base_time": 1.41,
      "is_market_road": false,
      "criticality": 0.0774,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 540.62
    }
  },
  {
    "data": {
      "id": "e117",
      "source": "24",
      "target": "36",
      "edge_id": 117,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.679,
      "base_time": 4.14,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1171.07
    }
  },
  {
    "data": {
      "id": "e118",
      "source": "24",
      "target": "12",
      "edge_id": 118,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.83,
      "base_time": 4.0,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1233.69
    }
  },
  {
    "data": {
      "id": "e119",
      "source": "24",
      "target": "33",
      "edge_id": 119,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.864,
      "base_time": 4.88,
      "is_market_road": false,
      "criticality": 0.4613,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1323.75
    }
  },
  {
    "data": {
      "id": "e120",
      "source": "24",
      "target": "27",
      "edge_id": 120,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.002,
      "base_time": 4.88,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1391.65
    }
  },
  {
    "data": {
      "id": "e121",
      "source": "25",
      "target": "20",
      "edge_id": 121,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.433,
      "base_time": 1.09,
      "is_market_road": false,
      "criticality": 0.006,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 303.87
    }
  },
  {
    "data": {
      "id": "e122",
      "source": "25",
      "target": "9",
      "edge_id": 122,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.619,
      "base_time": 1.42,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 422.88
    }
  },
  {
    "data": {
      "id": "e123",
      "source": "25",
      "target": "38",
      "edge_id": 123,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.843,
      "base_time": 1.93,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 575.59
    }
  },
  {
    "data": {
      "id": "e124",
      "source": "25",
      "target": "40",
      "edge_id": 124,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.876,
      "base_time": 1.34,
      "is_market_road": false,
      "criticality": 0.0089,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 542.66
    }
  },
  {
    "data": {
      "id": "e125",
      "source": "25",
      "target": "37",
      "edge_id": 125,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.325,
      "base_time": 1.98,
      "is_market_road": false,
      "criticality": 0.2054,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 816.9
    }
  },
  {
    "data": {
      "id": "e126",
      "source": "25",
      "target": "1",
      "edge_id": 126,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.404,
      "base_time": 3.07,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 946.6
    }
  },
  {
    "data": {
      "id": "e127",
      "source": "26",
      "target": "36",
      "edge_id": 127,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.313,
      "base_time": 3.13,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 906.83
    }
  },
  {
    "data": {
      "id": "e128",
      "source": "26",
      "target": "12",
      "edge_id": 128,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.551,
      "base_time": 2.3,
      "is_market_road": false,
      "criticality": 0.2857,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 954.76
    }
  },
  {
    "data": {
      "id": "e129",
      "source": "26",
      "target": "7",
      "edge_id": 129,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.455,
      "base_time": 3.4,
      "is_market_road": true,
      "criticality": 0.4524,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 999.19
    }
  },
  {
    "data": {
      "id": "e130",
      "source": "26",
      "target": "27",
      "edge_id": 130,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.414,
      "base_time": 3.31,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 971.52
    }
  },
  {
    "data": {
      "id": "e131",
      "source": "26",
      "target": "17",
      "edge_id": 131,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.311,
      "base_time": 3.46,
      "is_market_road": false,
      "criticality": 0.0238,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 933.35
    }
  },
  {
    "data": {
      "id": "e132",
      "source": "26",
      "target": "37",
      "edge_id": 132,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.616,
      "base_time": 3.6,
      "is_market_road": false,
      "criticality": 0.6875,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1095.07
    }
  },
  {
    "data": {
      "id": "e133",
      "source": "27",
      "target": "12",
      "edge_id": 133,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.078,
      "base_time": 0.13,
      "is_market_road": true,
      "criticality": 0.247,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 49.21
    }
  },
  {
    "data": {
      "id": "e134",
      "source": "27",
      "target": "36",
      "edge_id": 134,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.286,
      "base_time": 0.67,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 196.55
    }
  },
  {
    "data": {
      "id": "e135",
      "source": "27",
      "target": "17",
      "edge_id": 135,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.09,
      "base_time": 2.38,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 734.61
    }
  },
  {
    "data": {
      "id": "e136",
      "source": "27",
      "target": "7",
      "edge_id": 136,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.457,
      "base_time": 3.63,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 1019.34
    }
  },
  {
    "data": {
      "id": "e137",
      "source": "28",
      "target": "19",
      "edge_id": 137,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.662,
      "base_time": 1.08,
      "is_market_road": false,
      "criticality": 0.0238,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 415.7
    }
  },
  {
    "data": {
      "id": "e138",
      "source": "28",
      "target": "14",
      "edge_id": 138,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.834,
      "base_time": 1.97,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 574.49
    }
  },
  {
    "data": {
      "id": "e139",
      "source": "28",
      "target": "18",
      "edge_id": 139,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.339,
      "base_time": 1.87,
      "is_market_road": false,
      "criticality": 0.0476,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 814.62
    }
  },
  {
    "data": {
      "id": "e140",
      "source": "28",
      "target": "13",
      "edge_id": 140,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.565,
      "base_time": 2.39,
      "is_market_road": false,
      "criticality": 0.244,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 969.15
    }
  },
  {
    "data": {
      "id": "e141",
      "source": "29",
      "target": "21",
      "edge_id": 141,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.313,
      "base_time": 0.81,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 221.5
    }
  },
  {
    "data": {
      "id": "e142",
      "source": "29",
      "target": "30",
      "edge_id": 142,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.263,
      "base_time": 2.77,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 852.23
    }
  },
  {
    "data": {
      "id": "e143",
      "source": "29",
      "target": "8",
      "edge_id": 143,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 3.256,
      "base_time": 7.86,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 2256.95
    }
  },
  {
    "data": {
      "id": "e144",
      "source": "29",
      "target": "31",
      "edge_id": 144,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 4.121,
      "base_time": 6.78,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 2592.53
    }
  },
  {
    "data": {
      "id": "e145",
      "source": "29",
      "target": "5",
      "edge_id": 145,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 4.712,
      "base_time": 10.28,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 3174.97
    }
  },
  {
    "data": {
      "id": "e146",
      "source": "30",
      "target": "21",
      "edge_id": 146,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.896,
      "base_time": 2.06,
      "is_market_road": false,
      "criticality": 0.1726,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 612.5
    }
  },
  {
    "data": {
      "id": "e147",
      "source": "30",
      "target": "29",
      "edge_id": 147,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.98,
      "base_time": 2.48,
      "is_market_road": false,
      "criticality": 0.1131,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 688.83
    }
  },
  {
    "data": {
      "id": "e148",
      "source": "30",
      "target": "31",
      "edge_id": 148,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.723,
      "base_time": 4.28,
      "is_market_road": false,
      "criticality": 0.0476,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1696.38
    }
  },
  {
    "data": {
      "id": "e149",
      "source": "30",
      "target": "8",
      "edge_id": 149,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.848,
      "base_time": 6.5,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1942.88
    }
  },
  {
    "data": {
      "id": "e150",
      "source": "31",
      "target": "16",
      "edge_id": 150,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.787,
      "base_time": 2.59,
      "is_market_road": false,
      "criticality": 0.1458,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1095.04
    }
  },
  {
    "data": {
      "id": "e151",
      "source": "31",
      "target": "8",
      "edge_id": 151,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 2.196,
      "base_time": 5.25,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1517.93
    }
  },
  {
    "data": {
      "id": "e152",
      "source": "31",
      "target": "4",
      "edge_id": 152,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.989,
      "base_time": 4.43,
      "is_market_road": true,
      "criticality": 0.0089,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 1839.75
    }
  },
  {
    "data": {
      "id": "e153",
      "source": "31",
      "target": "30",
      "edge_id": 153,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.503,
      "base_time": 4.05,
      "is_market_road": false,
      "criticality": 0.3304,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1568.98
    }
  },
  {
    "data": {
      "id": "e154",
      "source": "31",
      "target": "7",
      "edge_id": 154,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 3.41,
      "base_time": 7.99,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 2343.55
    }
  },
  {
    "data": {
      "id": "e155",
      "source": "31",
      "target": "5",
      "edge_id": 155,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.66,
      "base_time": 4.3,
      "is_market_road": true,
      "criticality": 0.0476,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 1667.05
    }
  },
  {
    "data": {
      "id": "e156",
      "source": "32",
      "target": "11",
      "edge_id": 156,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.866,
      "base_time": 2.02,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 594.41
    }
  },
  {
    "data": {
      "id": "e157",
      "source": "32",
      "target": "33",
      "edge_id": 157,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.251,
      "base_time": 1.79,
      "is_market_road": false,
      "criticality": 0.0714,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 764.66
    }
  },
  {
    "data": {
      "id": "e158",
      "source": "32",
      "target": "3",
      "edge_id": 158,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.585,
      "base_time": 3.51,
      "is_market_road": false,
      "criticality": 0.0327,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1072.32
    }
  },
  {
    "data": {
      "id": "e159",
      "source": "32",
      "target": "22",
      "edge_id": 159,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.39,
      "base_time": 3.45,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1463.38
    }
  },
  {
    "data": {
      "id": "e160",
      "source": "32",
      "target": "15",
      "edge_id": 160,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 2.647,
      "base_time": 3.72,
      "is_market_road": false,
      "criticality": 0.0714,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1612.32
    }
  },
  {
    "data": {
      "id": "e161",
      "source": "33",
      "target": "32",
      "edge_id": 161,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.143,
      "base_time": 2.75,
      "is_market_road": false,
      "criticality": 0.131,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 791.52
    }
  },
  {
    "data": {
      "id": "e162",
      "source": "33",
      "target": "24",
      "edge_id": 162,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.393,
      "base_time": 3.53,
      "is_market_road": false,
      "criticality": 0.0149,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 979.52
    }
  },
  {
    "data": {
      "id": "e163",
      "source": "33",
      "target": "11",
      "edge_id": 163,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.526,
      "base_time": 2.47,
      "is_market_road": false,
      "criticality": 0.3125,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 956.63
    }
  },
  {
    "data": {
      "id": "e164",
      "source": "33",
      "target": "17",
      "edge_id": 164,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.917,
      "base_time": 2.8,
      "is_market_road": false,
      "criticality": 0.1994,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1176.5
    }
  },
  {
    "data": {
      "id": "e165",
      "source": "34",
      "target": "13",
      "edge_id": 165,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.457,
      "base_time": 1.1,
      "is_market_road": true,
      "criticality": 0.0298,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 316.51
    }
  },
  {
    "data": {
      "id": "e166",
      "source": "34",
      "target": "15",
      "edge_id": 166,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.995,
      "base_time": 1.59,
      "is_market_road": true,
      "criticality": 0.6339,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 622.04
    }
  },
  {
    "data": {
      "id": "e167",
      "source": "34",
      "target": "3",
      "edge_id": 167,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.195,
      "base_time": 1.88,
      "is_market_road": false,
      "criticality": 0.2411,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 744.61
    }
  },
  {
    "data": {
      "id": "e168",
      "source": "34",
      "target": "6",
      "edge_id": 168,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.476,
      "base_time": 2.4,
      "is_market_road": true,
      "criticality": 0.003,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 926.19
    }
  },
  {
    "data": {
      "id": "e169",
      "source": "35",
      "target": "2",
      "edge_id": 169,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.664,
      "base_time": 1.72,
      "is_market_road": false,
      "criticality": 0.0774,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 470.02
    }
  },
  {
    "data": {
      "id": "e170",
      "source": "35",
      "target": "10",
      "edge_id": 170,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.29,
      "base_time": 3.37,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 915.51
    }
  },
  {
    "data": {
      "id": "e171",
      "source": "35",
      "target": "23",
      "edge_id": 171,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.296,
      "base_time": 3.1,
      "is_market_road": false,
      "criticality": 0.0625,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 895.97
    }
  },
  {
    "data": {
      "id": "e172",
      "source": "35",
      "target": "39",
      "edge_id": 172,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.733,
      "base_time": 4.62,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1237.64
    }
  },
  {
    "data": {
      "id": "e173",
      "source": "35",
      "target": "19",
      "edge_id": 173,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 3.109,
      "base_time": 4.57,
      "is_market_road": false,
      "criticality": 0.0446,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1910.46
    }
  },
  {
    "data": {
      "id": "e174",
      "source": "36",
      "target": "12",
      "edge_id": 174,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.277,
      "base_time": 0.67,
      "is_market_road": true,
      "criticality": 0.006,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 192.12
    }
  },
  {
    "data": {
      "id": "e175",
      "source": "36",
      "target": "27",
      "edge_id": 175,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.378,
      "base_time": 0.91,
      "is_market_road": true,
      "criticality": 0.0,
      "gamma": 0.6,
      "rel_class": "low",
      "total_cost": 261.81
    }
  },
  {
    "data": {
      "id": "e176",
      "source": "36",
      "target": "17",
      "edge_id": 176,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.841,
      "base_time": 1.33,
      "is_market_road": false,
      "criticality": 0.0744,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 524.61
    }
  },
  {
    "data": {
      "id": "e177",
      "source": "36",
      "target": "26",
      "edge_id": 177,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.111,
      "base_time": 2.66,
      "is_market_road": false,
      "criticality": 0.0238,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 768.28
    }
  },
  {
    "data": {
      "id": "e178",
      "source": "36",
      "target": "7",
      "edge_id": 178,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.381,
      "base_time": 2.09,
      "is_market_road": true,
      "criticality": 0.5774,
      "gamma": 0.375,
      "rel_class": "low",
      "total_cost": 853.62
    }
  },
  {
    "data": {
      "id": "e179",
      "source": "36",
      "target": "24",
      "edge_id": 179,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.419,
      "base_time": 2.23,
      "is_market_road": false,
      "criticality": 0.4821,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 883.98
    }
  },
  {
    "data": {
      "id": "e180",
      "source": "37",
      "target": "1",
      "edge_id": 180,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.304,
      "base_time": 0.68,
      "is_market_road": false,
      "criticality": 0.4107,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 206.23
    }
  },
  {
    "data": {
      "id": "e181",
      "source": "37",
      "target": "40",
      "edge_id": 181,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.148,
      "base_time": 2.91,
      "is_market_road": false,
      "criticality": 0.1012,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 807.32
    }
  },
  {
    "data": {
      "id": "e182",
      "source": "37",
      "target": "25",
      "edge_id": 182,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.441,
      "base_time": 3.56,
      "is_market_road": false,
      "criticality": 0.1012,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1005.64
    }
  },
  {
    "data": {
      "id": "e183",
      "source": "37",
      "target": "20",
      "edge_id": 183,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.627,
      "base_time": 3.84,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1120.48
    }
  },
  {
    "data": {
      "id": "e184",
      "source": "37",
      "target": "26",
      "edge_id": 184,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.687,
      "base_time": 3.98,
      "is_market_road": false,
      "criticality": 0.6875,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1161.67
    }
  },
  {
    "data": {
      "id": "e185",
      "source": "38",
      "target": "20",
      "edge_id": 185,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 0.373,
      "base_time": 0.58,
      "is_market_road": false,
      "criticality": 0.0089,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 231.85
    }
  },
  {
    "data": {
      "id": "e186",
      "source": "38",
      "target": "9",
      "edge_id": 186,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.608,
      "base_time": 1.5,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 424.14
    }
  },
  {
    "data": {
      "id": "e187",
      "source": "38",
      "target": "25",
      "edge_id": 187,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.661,
      "base_time": 1.67,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 464.38
    }
  },
  {
    "data": {
      "id": "e188",
      "source": "38",
      "target": "1",
      "edge_id": 188,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.393,
      "base_time": 2.2,
      "is_market_road": false,
      "criticality": 0.1042,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 868.69
    }
  },
  {
    "data": {
      "id": "e189",
      "source": "38",
      "target": "40",
      "edge_id": 189,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.446,
      "base_time": 2.27,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 900.6
    }
  },
  {
    "data": {
      "id": "e190",
      "source": "39",
      "target": "10",
      "edge_id": 190,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.448,
      "base_time": 1.18,
      "is_market_road": false,
      "criticality": 0.006,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 318.75
    }
  },
  {
    "data": {
      "id": "e191",
      "source": "39",
      "target": "2",
      "edge_id": 191,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.042,
      "base_time": 2.27,
      "is_market_road": false,
      "criticality": 0.0476,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 701.83
    }
  },
  {
    "data": {
      "id": "e192",
      "source": "39",
      "target": "19",
      "edge_id": 192,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.206,
      "base_time": 2.67,
      "is_market_road": false,
      "criticality": 0.006,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 815.85
    }
  },
  {
    "data": {
      "id": "e193",
      "source": "39",
      "target": "35",
      "edge_id": 193,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.645,
      "base_time": 3.96,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1139.34
    }
  },
  {
    "data": {
      "id": "e194",
      "source": "39",
      "target": "14",
      "edge_id": 194,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.56,
      "base_time": 3.59,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 1066.69
    }
  },
  {
    "data": {
      "id": "e195",
      "source": "39",
      "target": "28",
      "edge_id": 195,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.794,
      "base_time": 2.52,
      "is_market_road": false,
      "criticality": 0.131,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 1092.65
    }
  },
  {
    "data": {
      "id": "e196",
      "source": "40",
      "target": "25",
      "edge_id": 196,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 0.886,
      "base_time": 2.16,
      "is_market_road": false,
      "criticality": 0.003,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 615.91
    }
  },
  {
    "data": {
      "id": "e197",
      "source": "40",
      "target": "37",
      "edge_id": 197,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.279,
      "base_time": 2.08,
      "is_market_road": false,
      "criticality": 0.1042,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 802.6
    }
  },
  {
    "data": {
      "id": "e198",
      "source": "40",
      "target": "20",
      "edge_id": 198,
      "road_type": "primary",
      "lanes": 2,
      "length_km": 1.133,
      "base_time": 1.67,
      "is_market_road": false,
      "criticality": 0.0089,
      "gamma": 0.25,
      "rel_class": "medium",
      "total_cost": 696.6
    }
  },
  {
    "data": {
      "id": "e199",
      "source": "40",
      "target": "9",
      "edge_id": 199,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.146,
      "base_time": 2.73,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 791.33
    }
  },
  {
    "data": {
      "id": "e200",
      "source": "40",
      "target": "1",
      "edge_id": 200,
      "road_type": "residential",
      "lanes": 1,
      "length_km": 1.204,
      "base_time": 3.12,
      "is_market_road": false,
      "criticality": 0.0,
      "gamma": 0.4,
      "rel_class": "low",
      "total_cost": 852.37
    }
  }
];
const INCIDENTS = [
  {
    "incident_id": "INC_002",
    "node_id": "23",
    "call_time_hours": "0.13",
    "call_time_formatted": "00:08",
    "severity": "urgent",
    "priority": "2",
    "service_time_min": "14.1",
    "description": "Urgent emergency at node 23"
  },
  {
    "incident_id": "INC_011",
    "node_id": "12",
    "call_time_hours": "6.08",
    "call_time_formatted": "06:05",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "11.9",
    "description": "Moderate emergency at node 12"
  },
  {
    "incident_id": "INC_014",
    "node_id": "21",
    "call_time_hours": "7.05",
    "call_time_formatted": "07:03",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "13.8",
    "description": "Moderate emergency at node 21"
  },
  {
    "incident_id": "INC_012",
    "node_id": "23",
    "call_time_hours": "7.77",
    "call_time_formatted": "07:46",
    "severity": "urgent",
    "priority": "2",
    "service_time_min": "18.9",
    "description": "Urgent emergency at node 23"
  },
  {
    "incident_id": "INC_009",
    "node_id": "15",
    "call_time_hours": "9.37",
    "call_time_formatted": "09:22",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "8.6",
    "description": "Moderate emergency at node 15"
  },
  {
    "incident_id": "INC_015",
    "node_id": "19",
    "call_time_hours": "10.62",
    "call_time_formatted": "10:37",
    "severity": "urgent",
    "priority": "2",
    "service_time_min": "14.6",
    "description": "Urgent emergency at node 19"
  },
  {
    "incident_id": "INC_003",
    "node_id": "34",
    "call_time_hours": "10.8",
    "call_time_formatted": "10:48",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "9.1",
    "description": "Moderate emergency at node 34"
  },
  {
    "incident_id": "INC_010",
    "node_id": "19",
    "call_time_hours": "11.02",
    "call_time_formatted": "11:01",
    "severity": "minor",
    "priority": "4",
    "service_time_min": "8.1",
    "description": "Minor emergency at node 19"
  },
  {
    "incident_id": "INC_008",
    "node_id": "15",
    "call_time_hours": "16.12",
    "call_time_formatted": "16:07",
    "severity": "urgent",
    "priority": "2",
    "service_time_min": "14.6",
    "description": "Urgent emergency at node 15"
  },
  {
    "incident_id": "INC_007",
    "node_id": "36",
    "call_time_hours": "16.42",
    "call_time_formatted": "16:25",
    "severity": "urgent",
    "priority": "2",
    "service_time_min": "15.9",
    "description": "Urgent emergency at node 36"
  },
  {
    "incident_id": "INC_005",
    "node_id": "2",
    "call_time_hours": "17.35",
    "call_time_formatted": "17:21",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "13.3",
    "description": "Moderate emergency at node 2"
  },
  {
    "incident_id": "INC_006",
    "node_id": "6",
    "call_time_hours": "17.98",
    "call_time_formatted": "17:59",
    "severity": "critical",
    "priority": "1",
    "service_time_min": "27.2",
    "description": "Critical emergency at node 6"
  },
  {
    "incident_id": "INC_013",
    "node_id": "29",
    "call_time_hours": "18.62",
    "call_time_formatted": "18:37",
    "severity": "moderate",
    "priority": "3",
    "service_time_min": "12.8",
    "description": "Moderate emergency at node 29"
  },
  {
    "incident_id": "INC_004",
    "node_id": "37",
    "call_time_hours": "21.17",
    "call_time_formatted": "21:10",
    "severity": "critical",
    "priority": "1",
    "service_time_min": "16.0",
    "description": "Critical emergency at node 37"
  },
  {
    "incident_id": "INC_001",
    "node_id": "26",
    "call_time_hours": "23.2",
    "call_time_formatted": "23:12",
    "severity": "critical",
    "priority": "1",
    "service_time_min": "17.1",
    "description": "Critical emergency at node 26"
  }
];
const VEHICLES = [
  {
    "vehicle_id": "VEH_01",
    "base_node": "1",
    "available_from": "0.0",
    "status": "available",
    "priority_rank": "1",
    "crew_size": "2",
    "fuel_capacity_L": "60",
    "avg_fuel_consumption_L_per_km": "0.12"
  },
  {
    "vehicle_id": "VEH_02",
    "base_node": "2",
    "available_from": "0.0",
    "status": "available",
    "priority_rank": "2",
    "crew_size": "2",
    "fuel_capacity_L": "60",
    "avg_fuel_consumption_L_per_km": "0.12"
  },
  {
    "vehicle_id": "VEH_03",
    "base_node": "3",
    "available_from": "0.0",
    "status": "available",
    "priority_rank": "3",
    "crew_size": "2",
    "fuel_capacity_L": "60",
    "avg_fuel_consumption_L_per_km": "0.12"
  },
  {
    "vehicle_id": "VEH_04",
    "base_node": "1",
    "available_from": "0.0",
    "status": "available",
    "priority_rank": "4",
    "crew_size": "2",
    "fuel_capacity_L": "60",
    "avg_fuel_consumption_L_per_km": "0.12"
  },
  {
    "vehicle_id": "VEH_05",
    "base_node": "2",
    "available_from": "0.0",
    "status": "available",
    "priority_rank": "5",
    "crew_size": "2",
    "fuel_capacity_L": "60",
    "avg_fuel_consumption_L_per_km": "0.12"
  }
];
const TIME_PROFILES = [
  {
    "time_period": "night",
    "start_hour": "0",
    "end_hour": "6",
    "multiplier_normal": "1.0",
    "multiplier_market": "1.0",
    "description": "Free flow conditions"
  },
  {
    "time_period": "morning_peak",
    "start_hour": "6",
    "end_hour": "9",
    "multiplier_normal": "1.5",
    "multiplier_market": "2.3",
    "description": "Morning rush hour with heavy market activity"
  },
  {
    "time_period": "midday",
    "start_hour": "9",
    "end_hour": "15",
    "multiplier_normal": "1.2",
    "multiplier_market": "1.8",
    "description": "Moderate traffic, market activity continues"
  },
  {
    "time_period": "evening_peak",
    "start_hour": "15",
    "end_hour": "19",
    "multiplier_normal": "1.6",
    "multiplier_market": "2.5",
    "description": "Evening rush hour, peak market congestion"
  },
  {
    "time_period": "late_evening",
    "start_hour": "19",
    "end_hour": "24",
    "multiplier_normal": "1.1",
    "multiplier_market": "1.2",
    "description": "Reduced traffic as markets close"
  }
];
