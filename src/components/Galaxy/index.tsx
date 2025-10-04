"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Audio from '@/components/Audio';

type GalaxyProps = {
    /** Accent color for the outer ring (was theme.primary). */
    primaryColor?: string; // e.g. "#89d3ce"
};

/** Shaders (unchanged) */
const vertex = /* glsl */ `
uniform float time;
uniform float size;
uniform float uAmp;
uniform vec3 uMouse;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
attribute vec3 pos;
float PI = 3.141592653589793238;

// --- noise helpers by Stefan Gustavson (MIT) ---
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5; gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0)); gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5; gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0)); gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110), vec4(n001,n101,n011,n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

mat3 rotation3dY(float angle){
  float s = sin(angle); float c = cos(angle);
  return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c);
}

vec3 fbm_vec3(vec3 p, float frequency, float offset){
  return vec3(
    cnoise((p+vec3(offset))*frequency),
    cnoise((p+vec3(offset+20.0))*frequency),
    cnoise((p+vec3(offset-30.0))*frequency)
  );
}
vec3 getOffset(vec3 p){
  float twist_scale = cnoise(pos)*0.5+0.5;
  vec3 temppos = rotation3dY(time*(0.5 + 0.5*twist_scale)+ length(pos.xz))*p;
  vec3 offset = fbm_vec3(pos, 0.5, 0.);
  return offset*0.2*uAmp;
}

void main(){
  vUv = position.xy + vec2(0.5);
  vec3 finalpos = pos + position*0.1;
  float particle_size = cnoise(pos*5.)*0.5 + 0.5;
  vec3 world_pos = rotation3dY(time*0.3*(0.1+0.5*particle_size))*pos;
  vec3 offset0 = getOffset(world_pos);
  vec3 offset = fbm_vec3(world_pos + offset0, 0., 0.);
  vec3 particle_position = (modelMatrix*vec4(world_pos + offset0, 1.)).xyz;
  float distanceToMouse = pow(1. - clamp(length(uMouse.xz - particle_position.xz)-0.3, 0., 1.), 4.);
  vec3 dir = particle_position - uMouse;
  particle_position = mix(particle_position, uMouse + normalize(dir)*0.1, distanceToMouse);
  vec4 view_pos = viewMatrix*vec4(particle_position, 1.);
  view_pos.xyz += position*size*(0.01+0.1*particle_size);
  gl_Position = projectionMatrix * view_pos;
}
`;

const fragment = /* glsl */ `
uniform float time;
uniform float progress;
uniform vec3 uColor;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main(){
  vec4 ttt = texture2D(uTexture, vUv);
  gl_FragColor = vec4(uColor, 0.6*ttt.r);
}
`;

export default function Galaxy({ primaryColor = "#89d3ce" }: GalaxyProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Scene / Camera / Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        // camera position
        camera.position.set(1, 1, 3);

        const setSizeToContainer = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        setSizeToContainer();
        // contorls the background color
        renderer.setClearColor(0x000000, 0);
        // renderer.physicallyCorrectLights = true;
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;

        // Raycaster helpers
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const point = new THREE.Vector3();

        // Invisible ground plane for mouse projection
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10, 10, 10).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        );
        // Not added to scene to keep it invisible; raycaster can still test against it.

        const materials: THREE.ShaderMaterial[] = [];

        const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

        function addObject(opts: {
            min_radius: number;
            max_radius: number;
            color: string;
            size: number;
            uAmp: number;
        }) {
            const count = 10000;
            const particlegeo = new THREE.PlaneGeometry(1, 1);
            const geo = new THREE.InstancedBufferGeometry();
            geo.instanceCount = count;
            geo.setAttribute("position", particlegeo.getAttribute("position"));
            geo.index = particlegeo.index;

            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const theta = Math.random() * 2 * Math.PI;
                const r = lerp(opts.min_radius, opts.max_radius, Math.random());
                const x = r * Math.sin(theta);
                const y = (Math.random() - 0.5) * 0.1;
                const z = r * Math.cos(theta);
                pos.set([x, y, z], i * 3);
            }
            geo.setAttribute("pos", new THREE.InstancedBufferAttribute(pos, 3, false));

            const material = new THREE.ShaderMaterial({
                // extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
                side: THREE.DoubleSide,
                uniforms: {
                    uTexture: { value: new THREE.TextureLoader().load("/galaxy/particle.webp") },
                    time: { value: 0 },
                    uAmp: { value: opts.uAmp },
                    uMouse: { value: new THREE.Vector3() },
                    size: { value: opts.size },
                    uColor: { value: new THREE.Color(opts.color) },
                    resolution: { value: new THREE.Vector4() },
                },
                transparent: true,
                depthTest: false,
                vertexShader: vertex,
                fragmentShader: fragment,
            });

            materials.push(material);
            const points = new THREE.Mesh(geo, material);
            scene.add(points);
        }

        // Rings (kept from your JS; outer ring uses primaryColor)
        const opts = [
            { min_radius: 0.7, max_radius: 1.5, color: "#f7b373", size: 1, uAmp: 1 },
            { min_radius: 0.4, max_radius: 1.5, color: "#88b3ce", size: 0.7, uAmp: 3 },
            { min_radius: 1.0, max_radius: 2.0, color: primaryColor, size: 0.9, uAmp: 4 },
        ];
        opts.forEach(addObject);

        // Pointer move → project to plane
        const onPointerMove = (event: PointerEvent) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects([mesh]);
            if (intersects.length > 0) {
                point.copy(intersects[0].point);
            }
        };
        window.addEventListener("pointermove", onPointerMove);

        // Animate
        let raf = 0;
        const animate = () => {
            materials.forEach((m) => {
                (m.uniforms.time.value as number) += 0.001;
                (m.uniforms.uMouse.value as THREE.Vector3).copy(point);
            });
            controls.update();
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        // Resize
        const onResize = () => {
            setSizeToContainer();
        };
        window.addEventListener("resize", onResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            renderer.dispose();
            scene.clear();
        };
    }, [primaryColor]);

    // UI (Tailwind replaces the old CSS)
    return (
        <div className="relative">
            {/* Down arrow */}

            <svg
                onClick={() => {
                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="absolute right-[2%] bottom-[5%] z-[100] h-[50px] w-[50px] cursor-pointer bg-transparent transition hover:scale-y-150"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 25 25"
                aria-label="Scroll to About"
                role="button"
            >
                <path
                    style={{ fill: "white" }}
                    d="m18.294 16.793-5.293 5.293V1h-1v21.086l-5.295-5.294-.707.707L12.501 24l6.5-6.5-.707-.707z"
                />
            </svg>

            <div className="absolute left-[2%] bottom-[5%] z-[110]">
                <Audio audioSrc="bg.mp3" />
            </div>


            {/* WebGL mount */}
            <div
                id="galaxy-container"
                ref={containerRef}
                className="h-[100svh] w-full overflow-hidden"
                style={{ background: "var(--background)" }}
            />
        </div>
    );
}