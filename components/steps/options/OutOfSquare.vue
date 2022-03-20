<template>
    <div>
        <h2 class="titlePage_subtitle titlePage">Out Of Square</h2>

        <Form v-slot="{ errors }" id="OSQFORM" action="" enctype="multipart/form-data" class="form">
            <div class="bordered">

                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="text text_center"
                        :class="{active: standard}"
                        @click="standard = true"
                    >Standard</h3>
                    <h3 class="text text_center"
                        :class="{active: !standard}"
                        @click="standard = !standard"
                    >Custom</h3>

                </div>
                <div v-if="standard">
                    <div class="square text_center d-flex justify-content-center" style="min-width: max-content;">

                      <canvas id="temp_canva" class="d-none"/>

                      <div ref="canvasWrapper" class="canvas-w" :style="`position: relative; pointer-events: ${hasCustomImage? 'none': 'auto'}`">
                      <p v-if="hasCustomImage" class="remove-image-warning">Please remove the uploaded file for custom drawings.</p>

                      <p v-if="outOfLimits > 0" class="remove-image-warning">{{outOfLimits}} sides are out of manufacturing limits.</p>
                      <div class="d-flex justify-content-center align-items-center" style="max-width: 80vw">
                        <div class="d-flex flex-column d-md-block text_left">
                          <label class="form__label form__label_row">
                            <input type="checkbox" class="form__checkbox" hidden :value="keepLinesStraight" @click.prevent="onKeepLinesStraight" :checked="keepLinesStraight"
                            >
                            <span class="form__checkbox_icon"></span>
                            <span class="form__labelTitle">Keep sides straight</span>
                          </label>

                          <label class="form__label form__label_row">
                            <input type="checkbox" class="form__checkbox" hidden name="" v-model="showDiagonals">
                            <span class="form__checkbox_icon"></span>
                            <span class="form__labelTitle">Show Diagonals</span>
                          </label>

                          <label class="form__label form__label_row">
                            <input type="checkbox" class="form__checkbox" hidden name="" v-model="showTable">
                            <span class="form__checkbox_icon"></span>
                            <span class="form__labelTitle">Show dimension details</span>
                          </label>

                        </div>
                        <button @click="zoomedIn = !zoomedIn" type="button" class="btn-zoom">
                          <svg-icon name="search-plus" v-if="!zoomedIn"/>
                          <svg-icon name="search-minus" v-else/>
                        </button>
                      </div>
                        <transition name="fade" mode="in-out" v-if="current_point">
                            <div ref="controller" class="size_popup container" v-cloak>
                                <div @click="current_point = null" class="controller-backdrop"></div>
                                <div class="row">
                                    <div class="col-12 text-center text_small text-uppercase py-1">
                                      <div class="relative">
                                        <span class="size-close-btn" type="button" @click="current_point = null">
                                          <svg-icon name="times"
                                                             class="cursor_pointer"
                                          />
                                        </span>

                                        <div class="flex-column">
                                          <h5 v-if="current_point==='tl'">Top Left</h5>
                                          <h5 v-else-if="current_point==='tm'">Top Middle</h5>
                                          <h5 v-else-if="current_point==='tr'">Top Right</h5>
                                          <h5 v-else-if="current_point==='mr'">Middle Right</h5>
                                          <h5 v-else-if="current_point==='br'">Bottom Right</h5>
                                          <h5 v-else-if="current_point==='bm'">Bottom Middle</h5>
                                          <h5 v-else-if="current_point==='bl'">Bottom Left</h5>
                                          <h5 v-else-if="current_point==='ml'">Middle Left</h5>
                                        </div>
                                      </div>
                                    </div>
                                </div>
                                <div class="row" v-if="current_point != 'ml' && current_point != 'mr'">
                                    <div class="col-6 offset-3 text_center p-0">
                                        <svg-icon name="chevron-up" @click="movePoint('up')" class="cursor_pointer"/>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-3 text_right align-self-center p-0">
                                        <svg-icon name="chevron-left"
                                                           v-if="current_point != 'tm' && current_point !=='bm'"
                                                           @click="movePoint('left')"
                                                           class="cursor_pointer"
                                        />
                                    </div>
                                    <div class="col-6">
                                        <label class="form__label my-1">
                                            <Field type="number" class="form__input text_center size-input"
                                                   name="Shift"
                                                   v-model="current_shift"
                                                   :rules="'required|decimal:1|min_value:0.5|max_value:100'"

                                            />
                                        </label>
                                    </div>
                                    <div class="col-3 p-0 text_left align-self-center">
                                        <svg-icon name="chevron-right"
                                                           v-if="current_point != 'tm' && current_point !=='bm'"
                                                           @click="movePoint('right')"
                                                           class="cursor_pointer"
                                        />
                                    </div>
                                </div>
                                <div class="row" v-if="current_point != 'ml' && current_point != 'mr'">
                                    <div class="col-6 offset-3 text_center">
                                        <svg-icon name="chevron-down"  class="cursor_pointer" @click="movePoint('down')"/>
                                    </div>
                                </div>
                            </div>
                        </transition>


                        <div :class="`table-svg-wrapper ${orientation} ${zoomedIn? 'zoomed-yes': 'zoomed-no'}`" ref="tableSvgWrapper">
                            <div id="svg-wrap" ref="svgWrapperDiv" overflow="visible" style="flex--: 1;">
                                <svg x="0" y="500" preserveAspectRatio="xMidYMid meet" :style="{height: '50vh'}"  class="canvas" ref="canvas" id="canvas" :viewBox="viewBox" overflow="visible">
                                    <line v-for="(l) in lines" :x1="coordinates.p[l.a].x" :y1="coordinates.p[l.a].y" :x2="coordinates.p[l.b].x"
                                        :y2="coordinates.p[l.b].y" class="dynamic_shape" :stroke="[l.out_of_limit ? 'red': '#55b494'] " stroke-width="2"/>
                                    //diagonals
                                    <line v-if="showDiagonals" :x1="coordinates.p.bl.x" :y1="coordinates.p.bl.y" :x2="coordinates.p.tr.x"
                                        :y2="coordinates.p.tr.y" class="diagonal" stroke="#777777" stroke-dasharray="5 2 5" stroke-width="1"/>
                                    <line v-if="showDiagonals" :x1="coordinates.p.br.x" :y1="coordinates.p.br.y" :x2="coordinates.p.tl.x"
                                        :y2="coordinates.p.tl.y" class="diagonal" stroke="#777777" stroke-dasharray="5 2 5" stroke-width="1"/>
                                    <line :x1="coordinates.p.ml.x" :y1="coordinates.p.ml.y" :x2="coordinates.p.mr.x"
                                        :y2="coordinates.p.mr.y" class="diagonal" stroke="#777777" stroke-dasharray="5 2 5" stroke-width="1"/>
                                    <line :x1="coordinates.p.tm.x" :y1="coordinates.p.tm.y" :x2="coordinates.p.bm.x"
                                        :y2="coordinates.p.bm.y" class="diagonal" stroke="#777777" stroke-dasharray="5 2 5" stroke-width="1"/>
                                    //original
                                    <line v-for="(l) in lines" :x1="coordinates.o[l.a].x" :y1="coordinates.o[l.a].y" :x2="coordinates.o[l.b].x"
                                        :y2="coordinates.o[l.b].y" stroke="#777777" stroke-dasharray="5 5" stroke-width="1"/>

                                    <g v-if="i.visible" v-for="(i, v) in coordinates.p" :key="v" >

                                      <circle r="6" :cx="i.x" :cy="i.y"  class="circle" @click="circleClick(v)"
                                             :ref="v"/>

                                      <circle r="18" :cx="i.x" :cy="i.y"  class="circle-overlay" fill="transparent" @click="circleClick(v)"
                                             :ref="v"/>
                                    </g>

                                  <svg v-if="((i.x - coordinates.o[v].x) !== 0 || ((i.y - coordinates.o[v].y)))" v-for="(i, v) in coordinates.p" overflow="visible" :x="i.x" :y="i.y" width="40" height="40" viewBox="0 0 24 24" fill="" >
                                    <!--up-->
                                    <template v-if="coordinates.o[v].y - i.y > 0 && i.visible">
                                      <path class="arrow-" :transform="`translate(-12,${['bl','br','bm'].includes(v)? '16': '-40' })`" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="arrows.up" stroke="black"/>
                                      <text class="text-class" :transform="`translate(0,${['bl','br','bm'].includes(v)? '45': '-40' })`" font-size="8" text-anchor="middle">{{Math.abs(p[v].y - o[v].y)}}</text>
                                    </template>

                                    <!--down-->
                                    <template v-if="coordinates.o[v].y - i.y < 0 && i.visible">
                                      <path class="arrow-" :transform="`translate(-12,${['bl','br','bm'].includes(v)? '16': '-40' })`" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="arrows.down" stroke="black"/>
                                      <text class="text-class" :transform="`translate(0,${['bl','br','bm'].includes(v)? '45': '-40' })`" font-size="8" text-anchor="middle">{{ Math.abs(p[v].y - o[v].y)}}</text>
                                    </template>

                                    <!--right-->
                                    <template v-if="coordinates.o[v].x - i.x < 0 && i.visible">
                                      <path class="arrow-" :transform="`translate(${['tl','bl','ml'].includes(v)? '-45': '15'} , -12)`" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="arrows.right" stroke="black"/>
                                      <text class="text-class" :transform="`translate(${['tl','bl','ml'].includes(v)? '-50': '40'} , 2)`" font-size="8" :text-anchor="`${['tl','bl','ml'].includes(v)? 'end': 'start'}`">{{ Math.abs(p[v].x - o[v].x)}}</text>
                                    </template>

                                    <!--left-->
                                    <template v-if="coordinates.o[v].x - i.x > 0 && i.visible">
                                      <path class="arrow-" :transform="`translate(${['tl','bl','ml'].includes(v)? '-45': '15'} , -12)`" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" :d="arrows.left" stroke="black"/>
                                      <text class="text-class" :transform="`translate(${['tl','bl','ml'].includes(v)? '-50': '40'} , 2)`" font-size="8" :text-anchor="`${['tl','bl','ml'].includes(v)? 'end': 'start'}`">{{ Math.abs(p[v].x - o[v].x)}}</text>
                                    </template>

                                  </svg>
                                    <text v-if="showTable && point.show" v-for="(point, position) in pointLabels" :x="coordinates.p[position].x + point.adjustX" :y="coordinates.p[position].y + point.adjustY" text-anchor="start" class="angle" :class="{red: corners.tl !== 90}" stroke="2">{{point.name}}</text>

                                    <text :x="coordinates.p.tl.x - 160" :y="coordinates.p.tl.y - 80" text-anchor="start" class="angle" :class="{red: corners.tl !== 90}" stroke="2" ref="label_tl" id="label_tl">{{Number(corners.tl).toFixed(2)}}&#176;</text>
                                    <text :x="coordinates.p.tr.x + 80" :y="coordinates.p.tr.y - 80" text-anchor="start" class="angle" :class="{red: corners.tr !== 90}" stroke="2" ref="label_tr" id="label_tr">{{Number(corners.tr).toFixed(2)}}&#176;</text>
                                    <text :x="coordinates.p.bl.x - 160" :y="coordinates.p.bl.y + 90" text-anchor="start" class="angle" :class="{red: corners.bl !== 90}" stroke="2" ref="label_bl" id="label_bl">{{Number(corners.bl).toFixed(2)}}&#176;</text>
                                    <text :x="coordinates.p.br.x + 80" :y="coordinates.p.br.y + 90" text-anchor="start" class="angle" :class="{red: corners.br !== 90}" stroke="2" ref="label_br" id="label_br">{{Number(corners.br).toFixed(2)}}&#176;</text>
                                    <text :transform="'translate(' + (labels.left.x - 140) + ', ' + labels.left.y + ') rotate('+ labels.left.rotation+ ')'" text-anchor="middle" stroke="2" class="measure" ref="label_ml" id="label_ml">{{labels.left.text}}</text>
                                    <text :transform="'translate(' + (labels.right.x + 130) + ', ' + labels.right.y + ') rotate('+ labels.right.rotation+ ')'" text-anchor="middle" stroke="2" class="measure" ref="label_mr" id="label_mr">{{labels.right.text}}</text>
                                    <text :x="labels.top.x" :y="labels.top.y - 100" text-anchor="middle" stroke="2" class="measure" ref="label_tm" id="label_tm">{{labels.top.text}}</text>
                                    <text :x="labels.bottom.x" :y="labels.bottom.y + 120" text-anchor="middle" stroke="2" class="measure" ref="label_bm" id="label_bm">{{labels.bottom.text}}</text>
                                    <text v-if="showDiagonals" :transform="'translate(' + labels.d1.x + ', ' + labels.d1.y + ') rotate('+ labels.d1.rotation+ ')'" text-anchor="middle" stroke="2">{{labels.d1.text}}</text>
                                    <text v-if="showDiagonals" :transform="'translate(' + labels.d2.x + ', ' + labels.d2.y + ') rotate('+ labels.d2.rotation+ ')'" text-anchor="middle" stroke="2">{{labels.d2.text}}</text>
                                    <text :transform="'translate(' + labels.mv.x + ', ' + labels.mv.y + ') rotate('+ labels.mv.rotation+ ')'" text-anchor="middle" stroke="2">{{labels.mv.text}}</text>
                                    <text :transform="'translate(' + labels.mh.x + ', ' + labels.mh.y + ') rotate('+ labels.mh.rotation+ ')'" text-anchor="middle" stroke="2">{{labels.mh.text}}</text>
                                </svg>
                            </div>

                            <div v-if="showTable" class="mt-5 table-wrapper" ref="tableWrapper">
                              <RenderOSQRTable :table-data="tableData"/>
                            </div>
                        </div>

                      </div>
                    </div>
                    <ul class="form__errorArray">
                        <li v-for="group in errors">
                            <ul>
                                <li v-for="(error, index) in group"
                                    :key="error.id"
                                    v-if="index === 0"
                                    class="form__error"
                                >{{ error }}
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>

                <div class="d-flex justify-content-center align-items-start upload" v-else>
                    <label class="upload__label">
                        <Field type="file" name="custom"
                               class="upload__input"
                               accept=".jpg, .jpeg, .png, .pdf, .DWG"
                               @change="onFilesChange"
                               :rules="'ext:jpg,jpeg,png,pdf,DWG'"
                               ref="up"
                               label="custom file"
                        />
                        <span class="btn btn_default upload__btn"><svg-icon name="solid/upload"></svg-icon> Upload Drawings</span>

                        <div class="preview-wrapper mt-3 p-3">
                          <span v-if="customImageUrl" class="preview-close" @click="onPreviewClose">
                            <svg-icon name="times" class="cursor_pointer"/>
                          </span>
                          <img class="" :src="previewImage" style="object-fit: contain"/>
                        </div>
                    </label>


                    <div v-if="file.length && !uploadStandard"
                         class="d-flex justify-content-center align-items-center fileDownload">
                  <span class="m-1 text_green fileDownload__img">
                    <svg-icon name="check-square"/>
                  </span>
                        <p class="text_default text_green fileDownload__name">{{file}}</p>

                        <span class="text_green fileDownload__img"
                              @click="delFile()"
                        >
                    <svg-icon name="times"/>
                  </span>
                    </div>

                    <ul class="form__errorArray">
                        <li v-for="group in errors">
                            <ul>
                                <li v-for="(error, index) in group"
                                    :key="error.id"
                                    v-if="index === 0"
                                    class="form__error"
                                >{{ error }}
                                </li>
                            </ul>
                        </li>
                    </ul>

<!--                    <button type="submit"-->
<!--                            @click.prevent="save"-->
<!--                            :disabled="uploadCustomFile"-->
<!--                            class="btn btn_default">Save-->
<!--                    </button>-->
                </div>
                <!--</transition>-->
            </div>
            <template v-if="actionLinksPortalTarget">
              <portal :to="actionLinksPortalTarget">
                <button type="submit"
                        @click.prevent="save"
                        :disabled="!uploadStandardFile || outOfLimits > 0"
                        class="btn btn_transparent"><svg-icon name="solid/check"></svg-icon> Done
                </button>
                  <button type="submit"
                          v-if="this.standard"
                          @click.prevent="reset"
                          class="btn btn_transparent ml-2"><svg-icon name="solid/ban"></svg-icon> Reset
                  </button>
              </portal>
            </template>
            <template v-else>
              <button type="submit"
                      @click.prevent="save"
                      :disabled="!uploadStandardFile || outOfLimits > 0"
                      class="btn btn_default"><svg-icon name="solid/check"></svg-icon> Done
              </button>
                <button type="submit"
                        @click.prevent="reset"
                        v-if="this.standard"
                        class="btn btn_transparent ml-2"><svg-icon name="solid/ban"></svg-icon> Reset
                </button>
            </template>
        </Form>
      <transition name="fade">
        <warning-modal v-if="showCustomImageWarning"  title="You have uploaded a custom image do you want to keep it?">
          <template v-slot:actions>
            <button class="btn btn_transparent mx-0" @click="() => promiseResponse(true)">Yes</button>
            <button class="btn btn_transparent mx-0" @click="() => promiseResponse(false)">No</button>
          </template>
        </warning-modal>
      </transition>

      <transition name="fade">
        <warning-modal v-if="noFileSelectedWarning"  title="Please select a file.">
          <template v-slot:actions>
            <button class="btn btn_transparent mx-0" @click="noFileSelectedWarning = false">Close</button>
          </template>
        </warning-modal>
      </transition>
      <transition name="fade">
        <div class="modal modal_wrap" v-if="showWarning"  @keyup.esc="setKeepLinesStraight(false)">
          <div class="modal_popup">
            <p class="text text_white">
              Are you sure you want to proceed?
              <span class="modal__close" @click="setKeepLinesStraight(false)">
           <svg-icon name="times"/>
          </span>
            </p>
            <p class="text_white">
              By selecting ”Keep Sides Straight”, the sides will be automatically straightened between each corner and its adjacent corners. Each corner will remain positioned where it is while the side middle dimensions will be corrected to straighten each side. Do you wish to proceed?
            </p>
            <div class="d-flex justify-content-between">
              <button class="btn btn_transparent" @click="() => setKeepLinesStraight(true)"><svg-icon name="solid/check"/> Yes</button>
              <button class="btn btn_transparent" @click="() => setKeepLinesStraight(false)"><svg-icon name="solid/times"/> No</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>

   /* import {Validator} from 'vee-validate';*/

   /* const dict = {
        custom: {
            file: {
                ext: 'Uploaded file does not meet file criteria. Acceptable formats are DWG, jpg, jpeg, PNG, PDF with size less than 5Mb',
            },
            custom: {
                ext: 'Uploaded file does not meet file criteria. Acceptable formats are DWG, jpg, jpeg, PNG, PDF with size less than 5Mb',
            }
        }
    };

    Validator.localize('en', dict);*/

    import {mapGetters} from 'vuex';
    import * as canvg from "canvg";
    import {defineAsyncComponent} from "vue";
    const RenderOSQRTable =  defineAsyncComponent(() => import("@/components/orders/RenderOSQRTable"));
    const WarningModal = defineAsyncComponent(() => import('@/components/modals/WarningModal'));
    export default {
        name: "OutOfSquare",
        components:{
          WarningModal, RenderOSQRTable,
        },
        data() {
            return {
                arrows: {
                  up: 'M8 7l4-4m0 0l4 4m-4-4v18',
                  down: 'M16 17l-4 4m0 0l-4-4m4 4V3',
                  right: 'M17 8l4 4m0 0l-4 4m4-4H3',
                  left: 'M7 16l-4-4m0 0l4-4m-4 4h18'
                },
                showWarning: false,
                zoomedIn: false,
                showTable: false,
                keepLinesStraight: true,
                noFileSelectedWarning: false,
                showCustomImageWarning: false,
                promiseResponse: async () => {},
                customImage: null,
                customImageUrl: '',
                showDiagonals: true,
                current_point: null,
                canvas_width: 200,
                canvas_height: 200,
                current_shift: 1,
                orientation: 'portrait',
                corners: {
                    tl: 0,
                    tr: 0,
                    bl: 0,
                    br: 0
                },
                coordinates: {
                    p: {
                        tl: {x: 0, y: 0, visible: true},
                        tm: {x: 0, y: 0, visible: true},
                        tr: {x: 0, y: 0, visible: true},
                        ml: {x: 0, y: 0, visible: true},
                        mr: {x: 0, y: 0, visible: true},
                        bl: {x: 0, y: 0, visible: true},
                        bm: {x: 0, y: 0, visible: true},
                        br: {x: 0, y: 0, visible: true}
                    },
                    o: {
                        tl: {x: 0, y: 0},
                        tm: {x: 0, y: 0},
                        tr: {x: 0, y: 0},
                        ml: {x: 0, y: 0},
                        mr: {x: 0, y: 0},
                        bl: {x: 0, y: 0},
                        bm: {x: 0, y: 0},
                        br: {x: 0, y: 0}

                    }
                },
                lines:{
                    lb: {
                        a: 'bl',
                        b: 'ml',
                        out_of_limit: false
                    },
                    lt: {
                        a: 'ml',
                        b: 'tl',
                        out_of_limit: false
                    },
                    tl: {
                        a: 'tl',
                        b: 'tm',
                        out_of_limit: false
                    },
                    tr: {
                        a: 'tm',
                        b: 'tr',
                        out_of_limit: false
                    },
                    rt: {
                        a: 'tr',
                        b: 'mr',
                        out_of_limit: false
                    },
                    rb: {
                        a: 'mr',
                        b: 'br',
                        out_of_limit: false
                    },
                    br: {
                        a: 'br',
                        b: 'bm',
                        out_of_limit: false
                    },
                    bl: {
                        a: 'bm',
                        b: 'bl',
                        out_of_limit: false
                    },

                },
                pointLabels: {
                  bl: {
                    x: 0,
                    y: 0,
                    adjustX: -25,
                    adjustY: 25,
                    name: 'A',
                    show: true
                  },
                  ml: {
                    x: 0,
                    y: 0,
                    adjustX: -25,
                    adjustY: 5,
                    name: 'B',
                    show: true
                  },
                  tl: {
                    x: 0,
                    y: 0,
                    adjustX: -25,
                    adjustY: -15,
                    name: 'C',
                    show: true
                  },
                  tm: {
                    x: 0,
                    y: 0,
                    adjustX: -5,
                    adjustY: -15,
                    name: 'D',
                    show: true
                  },
                  tr: {
                    x: 0,
                    y: 0,
                    adjustX: 20,
                    adjustY: -15,
                    name: 'E',
                    show: true
                  },
                  mr: {
                    x: 0,
                    y: 0,
                    adjustX: 20,
                    adjustY: 5,
                    name: 'F',
                    show: true
                  },
                  br: {
                    x: 0,
                    y: 0,
                    adjustX: 20,
                    adjustY: 20,
                    name: 'G',
                    show: true
                  },
                  bm: {
                    x: 0,
                    y: 0,
                    adjustX: -5,
                    adjustY: 25,
                    name: 'H',
                    show: true
                  }
                },
                labels:{
                    left: {
                        x: 0,
                        y: 0,
                        rotation: 90,
                        text: '',
                        show:true,
                    },
                    top: {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },
                    right: {
                        x: 0,
                        y: 0,
                        rotation: -90,
                        text: '',
                        show:true,

                    },
                    bottom: {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },
                    d1:{
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },
                    d2:{
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },
                    mv:{
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },
                    mh:{
                        x: 0,
                        y: 0,
                        rotation: 0,
                        text: '',
                        show:true,

                    },

                },
                p: {
                    tl: {x: 0, y: 0},
                    tm: {x: 0, y: 0},
                    tr: {x: 0, y: 0},
                    ml: {x: 0, y: 0},
                    mr: {x: 0, y: 0},
                    bl: {x: 0, y: 0},
                    bm: {x: 0, y: 0},
                    br: {x: 0, y: 0}
                },
                o: {
                    tl: {x: 0, y: 0},
                    tm: {x: 0, y: 0},
                    tr: {x: 0, y: 0},
                    ml: {x: 0, y: 0},
                    mr: {x: 0, y: 0},
                    bl: {x: 0, y: 0},
                    bm: {x: 0, y: 0},
                    br: {x: 0, y: 0}
                },

                orig_height: 0,
                ratio: 6,
                middleX: 0,

                m: {
                    length1: 0,
                    length2: 0,
                    length3: 0,
                    length4: 0,
                    middleH: 0,
                    middleW: 0,
                },
                fileCustom: {},

                file: '',

                showDanger: false,

                standard: true,
                middle: false,
                more: false,
                uploadCustomFile: false,
                uploadStandardFile: false,
                uploadStandard: true,
                uploadCustom: true,

                size: false,

                files: new FormData(),
            }
        },

        props: ['actionLinksPortalTarget'],

        mounted() {

            this.standard = !this.isCustomImage//!_.get(this.currentSettings,'is_custom_image', false) //!this.$store.getters['orderPosition/orderPosition'].isOutOfSquareCustomImage
            if (!this.standard)
                this.customImageUrl = this.$store.getters['orderPosition/orderPosition'].outOfSquareImageUrl

            this.keepLinesStraight = _.get(this.settings, 'keepLinesStraight', this.keepLinesStraight)

             if (!this.settings || this.isCustomImage) {
                this.p.bl.x = 0;
                this.p.bl.y = 0;

                this.p.bm.x = this.entered.wdb / 2;
                this.p.bm.y = 0;

                this.p.br.x = this.entered.wdb;
                this.p.br.y = 0;

                this.p.mr.x = this.entered.wdm;
                this.p.mr.y = (this.entered.htr / 2);

                this.p.ml.x = 0;
                this.p.ml.y = (this.entered.htr / 2);

                this.p.tr.x = this.entered.wdt;
                this.p.tr.y = this.entered.htr;

                this.p.tm.x = this.entered.wdt / 2;
                this.p.tm.y = this.entered.htm;

                this.p.tl.x = 0;
                this.p.tl.y = this.entered.htl;


                this.o.bl.x = 0;
                this.o.bl.y = 0;

                this.o.bm.x = this.entered.wdb / 2;
                this.o.bm.y = 0;

                this.o.br.x = this.entered.wdb;
                this.o.br.y = 0;

                this.o.mr.x = this.entered.wdm;
                this.o.mr.y = (this.entered.htr / 2);

                this.o.ml.x = 0;
                this.o.ml.y = (this.entered.htr / 2);

                this.o.tr.x = this.entered.wdt;
                this.o.tr.y = this.entered.htr;

                this.o.tm.x = this.entered.wdt / 2;
                this.o.tm.y = this.entered.htm;

                this.o.tl.x = 0;
                this.o.tl.y = this.entered.htl;



                this.m.length1 = this.entered.wdt ? this.entered.wdt : this.m.length1;
                this.m.length3 = this.entered.wdb ? this.entered.wdb : this.m.length3;

                this.m.length4 = this.entered.htl ? this.entered.htl : this.m.length4;
                this.m.length2 = this.entered.htr ? this.entered.htr : this.m.length2;

                this.m.middleW = this.entered.htm ? this.entered.htm : this.m.middleW;
                this.m.middleH = this.entered.wdm ? this.entered.wdm : this.m.middleH;
            }else{
                this.p = this.settings.p
                 this.o = this.settings.o
                 this.uploadStandardFile = true
                 this.uploadCustomFile = false
            }

            this.orig_height = this.entered.htl
            this.orig_width = this.entered.wdt

            if (this.entered.wdt / this.entered.htl > 1.1)
                this.orientation = 'landscape'

            this.heightRatio()
            // if((this.entered.wdt / this.entered.htl > 4) ||
            //     (this.entered.htl / this.entered.wdt> 4))
            //     this.zoomedIn = true;


            this.checkUpload(this.m.length1, true);
            this.checkUpload(this.m.length2, true);
            this.checkUpload(this.m.length3, true);
            this.checkUpload(this.m.length4, true);

        },

        methods: {
          onKeepLinesStraight(e, v) {
            setTimeout(() => {
              const isChecked = e.target.checked
              if (!isChecked) {
                this.showWarning = true
              }
              else {
                this.setKeepLinesStraight(false)
              }
            })
          },
          setKeepLinesStraight(val) {
            this.keepLinesStraight = val
            this.calcCoordinates()
            this.showWarning = false
          },
          calcPadding: _.debounce(function() {
              document.querySelector('#canvas').style.padding = '0'

              this.$nextTick(function() {
                let svgEl = document.querySelector('#canvas').getBoundingClientRect()
                let left = Math.min(
                  document.querySelector('#label_tl').getBoundingClientRect().left,
                  document.querySelector('#label_ml').getBoundingClientRect().left,
                  document.querySelector('#label_bl').getBoundingClientRect().left
                )

                let right = Math.max(
                  document.querySelector('#label_tr').getBoundingClientRect().right,
                  document.querySelector('#label_mr').getBoundingClientRect().right,
                  document.querySelector('#label_br').getBoundingClientRect().right,
                )

                let top = Math.min(
                  document.querySelector('#label_tr').getBoundingClientRect().top,
                  document.querySelector('#label_tm').getBoundingClientRect().top,
                  document.querySelector('#label_tl').getBoundingClientRect().top,
                )

                let bottom = Math.max(
                  document.querySelector('#label_br').getBoundingClientRect().bottom,
                  document.querySelector('#label_bl').getBoundingClientRect().bottom,
                  document.querySelector('#label_bm').getBoundingClientRect().bottom,
                )
                const incBy = 0//-25
                const padding = `${Math.abs(svgEl.top - top)+incBy}px ${Math.abs(svgEl.right - right)+incBy}px ${Math.abs(svgEl.bottom - bottom)+incBy}px ${Math.abs(svgEl.left - left)+incBy}px`
                document.querySelector('#canvas').style.padding = padding
              })
            }, 0),
            updateZoom(){
              this.$nextTick(function() {
                if(this.zoomedIn) {
                    this.$refs.canvas.style.height = 'auto'
                    this.$refs.canvas.style.maxHeight = '3000px'

                    const ch = this.$refs.canvas.clientHeight
                    this.$refs.canvas.style.height = `${ch}px`

                    // if(this.orientation === 'landscape') {
                      this.$refs.canvas.style.height = '100vh'

                      this.$refs.canvas.style.width = ``
                    // }
                }else {
                  this.$refs.canvas.style.height = '55vh'

                  if(this.orientation === 'landscape') {
                    this.$refs.canvas.style.height = 'auto'
                    this.$refs.canvas.style.maxHeight = '3000px'

                    const ch = this.$refs.canvas.clientHeight
                    // this.$refs.canvas.style.height = `${ch}px`
                    this.$refs.canvas.style.height = `50vh`

                  }
                }
                this.heightRatio()

                this.$nextTick(() => {
                    if((this.$refs.canvas.clientHeight/ this.$refs.canvas.clientWidth > 8)){
                        this.$refs.canvas.style.maxWidth = '400px'
                    }else {
                        this.$refs.canvas.style.maxWidth = ''
                    }

                    if((this.$refs.canvas.clientWidth/this.$refs.canvas.clientHeight > 8)) {
                        this.$refs.canvas.style.maxHeight = '250px'
                    }else {
                        this.$refs.canvas.style.maxHeight = ''
                    }
                })
              })
            },
            onPreviewClose(e) {
              this.$refs.up.value = null
              this.customImageUrl = null
              this.customImage = null

              e.preventDefault()
              e.stopPropagation()
            },
            setControllerPosition: _.debounce(function(){
                if(!this.current_point) return

                let pLeft = this.$refs[this.current_point][0].getBoundingClientRect().left
                let wrapperLeft = this.$refs.canvasWrapper.getBoundingClientRect().left

                let pTop = this.$refs[this.current_point][0].getBoundingClientRect().top
                let wrapperTop = this.$refs.canvasWrapper.getBoundingClientRect().top

                let pRight = this.$refs[this.current_point][0].getBoundingClientRect().right
                let wrapperRight = this.$refs.canvasWrapper.getBoundingClientRect().right

                const isBottom = ['bl', 'br', 'bm'].includes(this.current_point)
                const isRight = ['tr', 'mr', 'br'].includes(this.current_point)

                let left = pLeft - wrapperLeft + 15
                let top = pTop - wrapperTop + 25
                if(isBottom) {
                  top = top - this.$refs.controller.clientHeight
                }

                this.$refs.controller.style.top = `${top}px`

                if(isRight) {
                  let right = wrapperRight - pRight  + 15
                  this.$refs.controller.style.left = `auto`
                  this.$refs.controller.style.right = `${right}px`
                }else {
                  this.$refs.controller.style.right = `auto`
                  this.$refs.controller.style.left = `${left}px`
                }
            },1),
            movePoint(direction) {

                var coord = 'x'
                if (direction === 'up' || direction === 'down')
                    coord = 'y'

                var distance = this.current_shift
                if (direction === 'left' || direction === 'down')
                    distance = distance * -1
                this.p[this.current_point][coord] = Number(this.p[this.current_point][coord]) + Number(distance)

                this.heightRatio()

            },

            calcCoordinates() {
                if(this.keepLinesStraight) {
                  this.p.ml.x = (Math.abs(this.p.tl.x -  this.p.bl.x)/2) + Math.min(this.p.tl.x, this.p.bl.x)
                  this.p.mr.x = (Math.abs(this.p.tr.x -  this.p.br.x)/2) + Math.min(this.p.tr.x, this.p.br.x)
                  this.p.tm.y = (Math.abs(this.p.tr.y -  this.p.tl.y)/2) + Math.min(this.p.tr.y, this.p.tl.y)
                  this.p.bm.y = (Math.abs(this.p.br.y -  this.p.bl.y)/2) + Math.min(this.p.br.y, this.p.bl.y)
                }

                var p = JSON.parse(JSON.stringify(this.p)),
                    o = JSON.parse(JSON.stringify(this.o))

                var left_point = -1 * Math.min(p.bl.x, p.ml.x, p.tl.x)
                var upper_point = -1 * Math.min(p.bl.y, p.bm.y, p.br.y)

                var max_y = Math.max(p.tl.y, p.tm.y, p.tr.y)
                _.each(p, (i, v) => {
                        i.x = i.x / this.ratio + 15
                        i.y = (max_y -  i.y) / this.ratio + 15
                        i.visible = !(this.keepLinesStraight && ['ml', 'tm', 'mr', 'bm'].includes(v));
                    }
                )

                _.each(o, (i) => {
                        i.x = i.x / this.ratio + 15
                        i.y = (max_y - i.y) / this.ratio + 15
                    }
                )

                this.coordinates = {
                    p: p,
                    o: o
                }

                this.calcCorners()
                this.updateLabels()
                this.updateLines()
                this.calcPadding()


            },

            updateLines(){
                _.each(this.lines, (l) => {
                    var x = Math.abs(this.coordinates.p[l.a].x - this.coordinates.p[l.b].x)
                    var y = Math.abs(this.coordinates.p[l.a].y - this.coordinates.p[l.b].y)

                    l.out_of_limit = false
                    if (x !== 0 && y !== 0) {
                        var r = x / y
                        if (r > 1)
                            r = 1 / r
                        l.out_of_limit = r > 0.1
                    }

                    return l
                })
            },

            updateLabels() {

                this.labels.left.text = Number(this.p.tl.y - this.p.bl.y).toFixed(1) + 'mm'
                this.labels.top.text = Number(this.p.tr.x - this.p.tl.x).toFixed(1) + 'mm'
                this.labels.right.text = Number(this.p.tr.y - this.p.br.y).toFixed(1) + 'mm'
                this.labels.bottom.text = Number(this.p.br.x - this.p.bl.x).toFixed(1) + 'mm'

                this.labels.left.x = this.coordinates.p.ml.x + 15
                this.labels.left.y = this.coordinates.p.ml.y

                this.labels.right.x = this.coordinates.p.mr.x - 15
                this.labels.right.y = this.coordinates.p.mr.y

                this.labels.top.x = this.coordinates.p.tm.x
                this.labels.top.y = this.coordinates.p.tm.y + 15

                this.labels.bottom.x = this.coordinates.p.bm.x
                this.labels.bottom.y = this.coordinates.p.bm.y - 25

                this.labels.mv = {
                    text: this.p.tm.y - this.p.bm.y + 'mm',
                    x: (this.coordinates.p.mr.x - this.coordinates.p.ml.x) / 2 + 10,
                    y: this.coordinates.p.bm.y -((this.coordinates.p.bm.y - this.coordinates.p.tm.y) / 4 ) ,
                    rotation: -90
                }

                this.labels.mh = {
                    text: this.p.mr.x - this.p.ml.x + 'mm',
                    x: (this.coordinates.p.mr.x - this.coordinates.p.ml.x) / 2,
                    y: (this.coordinates.p.bm.y - this.coordinates.p.tm.y) / 2 + 30,
                    rotation: 0
                }


                var d1 = Math.sqrt(Math.pow(this.p.tl.y - this.p.br.y, 2) + Math.pow(this.p.br.x - this.p.tl.x, 2)).toFixed(1)
                var d2 = Math.sqrt(Math.pow(this.p.tr.x - this.p.bl.x, 2) + Math.pow(this.p.tr.y - this.p.bl.y, 2)).toFixed(1)

                this.labels.d1 = {
                    show: this.coordinates.p.tm.x - this.coordinates.p.tl.x >= 85,
                    text : d1 + 'mm',
                    x: ((this.coordinates.p.br.x + this.coordinates.p.tl.x)/4 + this.coordinates.p.tl.x) - 35,
                    y: (this.coordinates.p.br.y - this.coordinates.p.tl.y)/4 + this.coordinates.p.tl.y + 5,
                    rotation: 90 - Math.atan((this.p.br.x - this.p.tl.x) / (this.p.tl.y - this.p.bl.y)) * (180/Math.PI)
                }


                let d2X = (this.coordinates.p.tr.x + this.coordinates.p.bl.x) - ((this.coordinates.p.tr.x /4)) + 10
                let d2Y = (this.coordinates.p.bl.y - this.coordinates.p.tr.y)/4 + this.coordinates.p.tr.y + 10
                let d2Rotation = Math.atan((this.p.tr.x - this.p.bl.x) / (this.p.tr.y - this.p.br.y)) * (180/Math.PI) - 90
                let d2Show = this.coordinates.p.tr.x - this.coordinates.p.tm.x >= 85


                this.labels.d2 = {
                    show: d2Show,
                    text : d2 + 'mm',
                    x: d2X,
                    y: d2Y,
                    rotation: d2Rotation
                }

              this.pointLabels.tm.show = !this.keepLinesStraight
              this.pointLabels.ml.show = !this.keepLinesStraight
              this.pointLabels.mr.show = !this.keepLinesStraight
              this.pointLabels.bm.show = !this.keepLinesStraight

            },

            calcCorners(){
                //top left

                var tl_1 = Math.atan((this.p.tm.x - this.p.tl.x) / (this.p.tm.y - this.p.tl.y)) * (180/Math.PI)
                var tl_2 = Math.atan((this.p.tl.y - this.p.ml.y) / (this.p.ml.x - this.p.tl.x)) * (180/Math.PI)
                if (tl_1 < 0) tl_1 = 180 + tl_1
                if (tl_2 < 0) tl_2 = 180 + tl_2
                this.corners.tl = 90 + tl_2 - tl_1

                var tr_1 = Math.atan((this.p.tr.x - this.p.tm.x) / (this.p.tr.y - this.p.tm.y)) * (180/Math.PI)
                var tr_2 = Math.atan((this.p.tr.y - this.p.mr.y) / (this.p.tr.x - this.p.mr.x)) * (180/Math.PI)
                if (tr_1 < 0) tr_1 = 180 + tr_1
                if (tr_2 < 0) tr_2 = 180 + tr_2
                this.corners.tr = (tr_1 + tr_2) - 90

                var br_1 = Math.atan((this.p.mr.y - this.p.br.y) / (this.p.br.x - this.p.mr.x)) * (180/Math.PI)
                var br_2 = Math.atan((this.p.br.x - this.p.bm.x) / (this.p.br.y - this.p.bm.y)) * (180/Math.PI)
                if (br_1 < 0) br_1 = 180 + br_1
                if (br_2 < 0) br_2 = 180 + br_2
                this.corners.br = br_1 - br_2 + 90

                var bl_1 = Math.atan((this.p.bl.y - this.p.bm.y) / (this.p.bm.x - this.p.bl.x)) * (180/Math.PI)
                var bl_2 = Math.atan((this.p.ml.y - this.p.bl.y) / (this.p.bl.x - this.p.ml.x)) * (180/Math.PI)
                if (bl_2 < 0) bl_2 = 180 + bl_2
                this.corners.bl = 180 + bl_1 - bl_2
            },
            promptCustomImageConfirmation() {
              this.showCustomImageWarning = true
              return new Promise((resolve, reject) => {
                this.promiseResponse = (response) => {
                  this.showCustomImageWarning = false
                  resolve(response)
                }
              })
            },
            generateStandardImageFromSvg() {
              document.querySelector('#canvas').classList.add('canvas-printing')

              let left = Math.min(
                document.querySelector('#label_tl').getBoundingClientRect().left,
                document.querySelector('#label_ml').getBoundingClientRect().left,
                document.querySelector('#label_bl').getBoundingClientRect().left
              )

              let right = Math.max(
                document.querySelector('#label_tr').getBoundingClientRect().right,
                document.querySelector('#label_mr').getBoundingClientRect().right,
                document.querySelector('#label_br').getBoundingClientRect().right,
              )

              let top = Math.min(
                document.querySelector('#label_tr').getBoundingClientRect().top,
                document.querySelector('#label_tm').getBoundingClientRect().top,
                document.querySelector('#label_tl').getBoundingClientRect().top,
              )

              let bottom = Math.max(
                document.querySelector('#label_br').getBoundingClientRect().bottom,
                document.querySelector('#label_bl').getBoundingClientRect().bottom,
                document.querySelector('#label_bm').getBoundingClientRect().bottom,
              )

              const svgWidth = Math.abs(right - left) + 20
              const svgHeight = Math.abs(bottom - top) + 20






              const w = svgWidth//this.$refs.svgWrapperDiv.clientWidth; //document.querySelector('#svg-wrap').clientWidth //
              const h = svgHeight//this.$refs.svgWrapperDiv.clientHeight //document.querySelector('#svg-wrap').clientHeight //
              const widthMultiplier = 4//w/h >= 1.8? 3: 4
              const canvas = document.getElementById('temp_canva');
              canvas.width = w * widthMultiplier; //set canvas sizes
              canvas.height = h * 4;
              let v = canvg.Canvg.fromString(canvas.getContext('2d'), document.getElementById("svg-wrap").outerHTML);
              v.render();
              let MIME_TYPE = "image/png";
              // document.querySelector('#canvas').classList.remove('canvas-printing')

              return canvas.toDataURL(MIME_TYPE);

            },
            async save() {
                if(!this.standard && !this.hasCustomImage){
                  return this.noFileSelectedWarning = true
                }

                this.zoomedIn = false//(this.entered.wdt / this.entered.htl > 4) || (this.entered.htl / this.entered.wdt> 4)

                await this.$nextTick()
                const table = (_.isEqual(this.p, this.o) || this.hasCustomImage )? null: this.tableData

                this.$store.commit('orderPosition/setOption', { option: 'OSQR', selection: {is_custom_image: this.hasCustomImage, p: this.p, o: this.o, table, keepLinesStraight: this.keepLinesStraight }});
                this.$store.commit('orderPosition/saveOSQR');

                let imageUrl = this.customImageUrl

                if(!this.hasCustomImage) {
                  imageUrl = this.generateStandardImageFromSvg()
                  this.$store.commit('orderPosition/setOutOfSquareStandardImageUrl', imageUrl)
                }else {
                  this.$store.commit('orderPosition/setOutOfSquareCustomImageUrl', {imageUrl, p: this.p})
                }
                this.$store.commit('orderPosition/goToStep', 'All Options')


            },

            circleClick(point) {
                if(this.keepLinesStraight && ['tm', 'bm', 'ml', 'mr'].includes(point)) return
                this.current_point = point
            },
            closePopup() {
                this.$emit('close');
            },

            custom(event) {
                this.fileCustom = event.target.files[0];
            },

            heightRatio() {
                // if (this.orientation === 'portrait') {
                    if (this.$refs.canvas.clientHeight == 0 || this.orig_height == 0)
                        this.ratio = 3;
                    else
                        this.ratio = this.orig_height / (this.$refs.canvas.clientHeight - 30)

                    if (this.ratio < 1)
                        this.ratio = 1

                    const w = Math.max(this.p.br.x, this.p.mr.x, this.p.tr.x) - Math.min(this.p.bl.x, this.p.ml.x, this.p.tl.x)
                    this.canvas_width = w / this.ratio + 30

                    this.calcCoordinates()

            },

            onFilesChange(event) {
                const files = event.target.files
                let filename = files[0].name
                const fileReader = new FileReader()
                fileReader.addEventListener('load', () => {
                  this.customImageUrl = fileReader.result
                })
                fileReader.readAsDataURL(files[0])
                this.customImage = files[0]

                this.files.delete(event.target.name);
                this.file = event.target.files[0].name;
                this.size = false;
                this.reset()

                if (event.target.files[0].size < 5000000) {
                    this.size = false;
                    _.forEach(event.target.files, (v, k) => {
                        if (event.target.files.length > 0 && this.uploadStandardFile) {
                            this.uploadStandard = true;
                            this.uploadStandardFile = true;
                        }

                        if (event.target.files.length > 0 && this.middle) {
                            this.uploadStandard = true;
                            this.uploadStandardFile = true;
                        }

                        if (event.target.files.length > 0 && this.uploadCustomFile) {
                            this.uploadCustom = true;
                            this.uploadCustomFile = false;
                        }
                        this.files.append(event.target.name, v);
                    });
                }

                else {
                    this.size = true;
                    this.file = new FormData();
                }
            },

            checkUpload(side, ismiddle) {
                const paramLess = 0.01;
                const paramMore = 0.04;

                let l1 = parseFloat(this.m.length1),
                    l2 = parseFloat(this.m.length2),
                    l3 = parseFloat(this.m.length3),
                    l4 = parseFloat(this.m.length4),
                    mw = parseFloat(this.m.middleW),
                    mh = parseFloat(this.m.middleH);

                let result;

                if (side === this.m.length1 || side === this.m.length3) {

                    if (l2 === l4) {
                        result = Math.abs((l1 - l3) / l2).toFixed(4);
                    }

                    else if (l2 < l4) {
                        result = Math.abs((l1 - l3) / l2).toFixed(4)
                    }

                    else if (l4 < l2) {
                        result = Math.abs((l1 - l3) / l4).toFixed(4)
                    }
                }

                if (side === this.m.length4 || side === this.m.length2) {
                    if (l1 === l3) {
                        result = Math.abs((l4 - l2) / l1).toFixed(4);
                    }

                    else if (l1 < l3) {
                        result = Math.abs((l4 - l2) / l1).toFixed(4)
                    }

                    else if (l3 < l1) {
                        result = Math.abs((l4 - l2) / l3).toFixed(4)
                    }
                }


                if (result >= paramMore) {
                    this.uploadStandardFile = false;
                    this.uploadStandard = false;
                    this.uploadCustomFile = true;
                    this.showDanger = true;

                    this.middle = false;
                    this.more = true;
                    if (this.file) {
                        this.uploadCustomFile = true;
                    }
                }

                if (paramMore > result > paramLess || result < paramLess) {
                    this.uploadCustomFile = true;
                    this.uploadStandardFile = false;
                    this.uploadCustom = false;
                    this.showDanger = false;
                    this.middle = true;
                    this.more = false;
                    if (this.file) {
                        this.uploadStandardFile = true;
                    }
                }

                if (result <= paramLess) {
                    this.showDanger = false;
                    this.uploadCustomFile = true;
                    this.uploadStandardFile = true;
                    this.uploadStandard = true;

                    this.middle = false;
                    this.more = false;
                }

                // if (!ismiddle)
                //   this.checkMiddle();
            },

            checkMiddle() {
              this.m.middleH = Math.ceil((parseFloat(this.m.length1) + parseFloat(this.m.length3)) / 2);
              this.m.middleW = Math.ceil((parseFloat(this.m.length2) + parseFloat(this.m.length4)) / 2);
            },

            delFile() {
                this.file = '';
                const input = this.$refs.up;
                input.type = 'text';
                input.type = 'file';

                this.uploadCustomFile = true;

                if (this.middle) {
                    this.uploadStandardFile = false;
                }
            },
            reset(){
                this.p = _.cloneDeep(this.o)
                this.calcCoordinates()
            }

        },
        watch: {
          keepLinesStraight: {
            handler: function (val, oldVal) {
              this.calcCoordinates()
            },
          },
          standard: {
            handler: function (val, oldVal) {
              if(val) this.updateZoom()
            },
            immediate: true,
          },
          zoomedIn: {
            handler: function (val, oldVal) {
              if(this.standard) this.updateZoom()
            },
            immediate: true,
          },
          coordinates: {
            handler: function() {
                this.setControllerPosition()
            },
            deep: true
          },
          current_point: {
              handler: function (val, oldVal) {
                this.setControllerPosition()
              },
              immediate: true
          }
        },
        computed: {
            tableData() {
                return {
                    drop: {
                        name: 'Drop',
                        values: [
                            {
                                name: `Left (${this.pointLabels.tl.name}-${this.pointLabels.bl.name})`,
                                value: this.labels.left.text
                            },
                            {
                                name: `Middle (${this.pointLabels.tm.name}-${this.pointLabels.bm.name})`,
                                value: this.labels.mv.text
                            },
                            {
                                name: `Right (${this.pointLabels.tr.name}-${this.pointLabels.br.name})`,
                                value: this.labels.right.text
                            },
                        ]
                    },
                    width: {
                        name: 'Width',
                        values: [
                            {
                                name: `Top (${this.pointLabels.tl.name}-${this.pointLabels.tr.name})`,
                                value: this.labels.top.text
                            },
                            {
                                name: `Middle (${this.pointLabels.ml.name}-${this.pointLabels.mr.name})`,
                                value: this.labels.mh.text
                            },
                            {
                                name: `Bottom (${this.pointLabels.bl.name}-${this.pointLabels.br.name})`,
                                value: this.labels.bottom.text
                            },
                        ]
                    },
                    corners: {
                        name: 'Corners',
                        values: [
                            {
                                name: this.pointLabels.tl.name,
                                value: Number(this.corners.tl).toFixed(2)
                            },
                            {
                                name: this.pointLabels.tr.name,
                                value: Number(this.corners.tr).toFixed(2)
                            },
                            {
                                name: this.pointLabels.br.name,
                                value: Number(this.corners.br).toFixed(2)
                            },
                            {
                                name: this.pointLabels.bl.name,
                                value: Number(this.corners.bl).toFixed(2)
                            },
                        ]
                    },
                    diagonals: {
                        name: 'Diagonals',
                        values: [
                            {
                                name: `${this.pointLabels.tl.name} - ${this.pointLabels.br.name}`,
                                value: this.labels.d1.text
                            },
                            {
                                name: `${this.pointLabels.tr.name} - ${this.pointLabels.bl.name}`,
                                value: this.labels.d2.text
                            },
                        ]
                    }
                }
            },
            previewImage() {
              if(!this.customImageUrl) return ''
              if((this.customImageUrl.match('image/png') || this.customImageUrl.match('image/jpeg') || this.customImageUrl.match('image/gif'))) {
                return this.customImageUrl
              }else {
                return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' color='lightgray' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /%3E%3C/svg%3E`
              }
            },
            isCustomImage() {
              return _.get(this,'settings.is_custom_image', false)
            },
            hasCustomImage() {
              return !!this.customImageUrl;
            },
            viewBox() {
              const h = Math.max(this.p.tl.y, this.p.tm.y, this.p.tr.y) - Math.min(this.p.br.y, this.p.bl.y, this.p.bm.y)
              let vh =  (h / this.ratio) + 30

              let minLeft = Math.min(this.p.bl.x, this.p.ml.x, this.p.tl.x)
              let adjustLeft = minLeft < 0? minLeft: 0
              return `${adjustLeft} 0 ${this.canvas_width-adjustLeft} ${vh}`
            },
            entered() {
                return this.$store.getters['orderPosition/orderPosition'];
            },
            outOfLimits(){
                return _.filter(this.lines, i => {return i.out_of_limit}).length
            },
            ...mapGetters({
                settings: 'orderPosition/getCurrentOptionSettings',
                update: 'types/updates',
            })
        },
        created() {
            window.addEventListener("resize", this.heightRatio);
        },
        unmounted() {
            window.removeEventListener("resize", this.heightRatio);
        },
        updated() {
            // this.checkMiddle();
        }
    }
</script>

<style scoped lang="scss">
    .controller-backdrop {
      position: fixed;
      left: 0;
      top:0;
      right: 0;
      bottom: 0;
      background-color: transparent;
    }
    //Experiment

    .zoomed-no {
      #svg-wrap {
        .canvas {
          &:not(.canvas-printing) {
            // width: 83vw!important;

            @media screen and (max-width: 768px) {
              height: 42vh!important;
            }

            @media screen and (min-width: 768px) {
              // width: unset!important;
            }
          }




        }
      }
    }
    //End experiment
    .angle, .measure {
      font-size: 1.5em;
      font-size: 20px;
      @media screen and (max-width: 768px) {
        font-size: 25px;
      }
    }

    .w-full {
      width: 100%;
    }
    .square {
      padding: 20px 0;
    }
    .table-wrapper {
      font-size: 14px;
    }
    .table-svg-wrapper {
      display: flex;
      &.portrait {
        align-items: flex-start;
        justify-content: center;
      }
      &.landscape {
        flex-direction: column;
        align-items: center;
      }
      @media screen and (max-width: 768px) {
        &.portrait, &.landscape {
          flex-direction: column;
          align-items: center;
        }
      }
    }
    .btn-zoom {
      cursor: pointer;
      background: none;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 27px;
      border: 1px solid lightgray;
      color: darkgray;
      box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0
    }
    .remove-image-warning {
      margin-bottom: 12px;
      color: #A97745;
      background: #FDFDEA;
      padding: 17px 16px;
      text-align: left;
      border-left: 5px solid #E3A008;
    }
    .preview-wrapper {
      display: flex;
      width: 200px;
      min-height: 200px;
      position: relative;
      border-radius: 5px;
      box-shadow: rgba(51, 51, 51, 0.25) 0px 4px 10px 0px
    }
    .preview-close {
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(100%, -100%);
      background: #EDEDE8;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 11px;
    }
    .modal_popup .form__labelTitle {
      color: #0E3753;
    }
    .form__label {
      display: inline-flex;
    }
    .text-uppercase {
      text-transform: uppercase;
    }

    .modal__close {
        color: #51B592;
    }

    .original_shape {
        stroke: #777777;
        stroke-dasharray: 5 5;
        stroke-width: 2;
    }

    .dynamic_shape {
        /*stroke: #55b494;*/
        /*stroke-width: 3;*/
    }

    .diagonal{
        stroke: #777777;
        stroke-dasharray: 5 2 5;
        stroke-width: 1;
    }

    .canvas {
        //height: 50vh;
        display: block;
        margin: 20px auto 0 auto;
        padding: 4em 9em;
        overflow: visible;

        .circle {
            stroke-width: 4;
            fill: #55b494;
            stroke: #0E3753;
            cursor: pointer;
        }

        .circle-overlay {
          cursor: pointer;
        }

        .angle{
            fill: #0E3753;

            &.red{
                fill: darkred;
            }
        }

    }

    .size-close-btn {
      position: absolute;
      right: 5px;
    }
    .size-input {
      font-size: 14px;
      border-radius: 5px;
      padding: 4px 0px;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type=number] {
      -moz-appearance: textfield;
    }

    .size_popup {
        position: absolute;
        left: -10000px;
        z-index: 2;
        background-color: #55b494;
        width: 122px;
        border-radius: 5px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);
        h5 {
          font-size: 11px;
        }
    }

    h3.text {
        margin: 0 0 20px;
        border-bottom: 2px solid #B5B5B5;
        cursor: pointer;
        &.active {
            border-color: #0E3753;
        }
    }
</style>
