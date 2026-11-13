"""Build Raluca (stylised dog) in Blender: mesh, colours, rig, animations, GLB export."""
import bpy, bmesh, math
from mathutils import Vector, Matrix, Euler

import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "neu", "welt", "raluca.glb")
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = 30


def srgb(r, g, b):
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return Vector((f(r), f(g), f(b)))


COAT = srgb(0.83, 0.56, 0.30)
COAT_DARK = srgb(0.66, 0.41, 0.21)
CREAM = srgb(0.97, 0.86, 0.66)
EAR_IN = srgb(0.55, 0.33, 0.22)
NOSE = srgb(0.06, 0.05, 0.05)
MUZZLE_DARK = srgb(0.50, 0.30, 0.16)
TONGUE = srgb(0.93, 0.47, 0.52)
COLLAR = srgb(0.13, 0.10, 0.09)
TAG = srgb(0.95, 0.72, 0.18)
WHITE = srgb(0.98, 0.98, 0.98)

parts = []


def ball(p, r, scale=(1, 1, 1), rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=r, location=p)
    o = bpy.context.object
    o.scale = scale
    o.rotation_euler = rot
    parts.append(o)
    return o


def limb(pts):
    """pts: list of (pos, radius); fills tapered capsules between them."""
    for (a, ra), (b, rb) in zip(pts, pts[1:]):
        a, b = Vector(a), Vector(b)
        n = max(2, int((b - a).length / (min(ra, rb) * 0.5)))
        for i in range(n + 1):
            t = i / n
            ball(a.lerp(b, t), ra + (rb - ra) * t)


# ---------- body shape (dog faces -Y, Z up, metres) ----------
ball((0, 0.04, 0.50), 1, (0.135, 0.30, 0.145))            # torso
ball((0, -0.19, 0.485), 1, (0.148, 0.16, 0.175))          # deep chest
ball((0, -0.27, 0.50), 1, (0.12, 0.10, 0.15))             # chest ruff
ball((0, 0.27, 0.50), 1, (0.135, 0.15, 0.15))             # hindquarters
ball((0, 0.10, 0.45), 1, (0.11, 0.21, 0.095))             # tucked belly
limb([((0, -0.24, 0.56), 0.11), ((0, -0.32, 0.68), 0.092), ((0, -0.365, 0.77), 0.085)])  # neck
ball((0, -0.385, 0.805), 1, (0.102, 0.108, 0.096))        # skull
ball((0, -0.36, 0.77), 1, (0.115, 0.075, 0.075))          # cheek fluff
limb([((0, -0.45, 0.80), 0.057), ((0, -0.57, 0.787), 0.041)])    # muzzle top
limb([((0, -0.43, 0.752), 0.042), ((0, -0.535, 0.698), 0.024)])  # lower jaw (open, smiling)
for s in (1, -1):
    # ears: big, upright, slightly outward
    limb([((s * 0.058, -0.365, 0.875), 0.046), ((s * 0.076, -0.36, 0.945), 0.032), ((s * 0.092, -0.355, 1.03), 0.011)])
    ball((s * 0.064, -0.352, 0.895), 1, (0.056, 0.024, 0.07))
    # front legs
    limb([((s * 0.082, -0.20, 0.47), 0.072), ((s * 0.085, -0.215, 0.30), 0.050),
          ((s * 0.085, -0.215, 0.09), 0.037)])
    ball((s * 0.085, -0.245, 0.036), 1, (0.046, 0.064, 0.034))
    # hind legs
    limb([((s * 0.088, 0.27, 0.47), 0.098), ((s * 0.098, 0.235, 0.30), 0.062),
          ((s * 0.098, 0.36, 0.17), 0.039), ((s * 0.098, 0.345, 0.07), 0.033)])
    ball((s * 0.098, 0.315, 0.036), 1, (0.046, 0.066, 0.034))
# bushy tail, carried up and back
limb([((0, 0.38, 0.55), 0.05), ((0, 0.47, 0.64), 0.07), ((0, 0.58, 0.72), 0.082),
      ((0, 0.70, 0.74), 0.07), ((0, 0.79, 0.70), 0.032)])

bpy.ops.object.select_all(action="DESELECT")
for o in parts:
    o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.join()
body = bpy.context.object
body.name = "Raluca"
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

m = body.modifiers.new("remesh", "REMESH")
m.mode = "VOXEL"
m.voxel_size = 0.0075
m.use_smooth_shade = True
bpy.ops.object.modifier_apply(modifier=m.name)
m = body.modifiers.new("smooth", "SMOOTH")
m.factor = 0.6
m.iterations = 12
bpy.ops.object.modifier_apply(modifier=m.name)
m = body.modifiers.new("dec", "DECIMATE")
m.ratio = 0.13
bpy.ops.object.modifier_apply(modifier=m.name)
m = body.modifiers.new("smooth2", "SMOOTH")
m.factor = 0.4
m.iterations = 2
bpy.ops.object.modifier_apply(modifier=m.name)
bpy.ops.object.shade_smooth()
print("body tris:", sum(len(p.vertices) - 2 for p in body.data.polygons))

# ---------- coat colours ----------
def sstep(a, b, x):
    t = min(1, max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def blob(v, c, r):
    """1 inside, fading to 0 at radius r from centre c."""
    return 1 - sstep(0.55, 1.0, (v - Vector(c)).length / r)


def ell(v, c, r):
    d = Vector(((v.x - c[0]) / r[0], (v.y - c[1]) / r[1], (v.z - c[2]) / r[2])).length
    return 1 - sstep(0.6, 1.0, d)


col = body.data.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
body.data.calc_loop_triangles()
for v in body.data.vertices:
    p, n = v.co, v.normal
    c = COAT.copy()
    # darker saddle along the back and top of the head
    back = sstep(0.55, 0.62, p.z) * sstep(-0.30, -0.15, p.y) * (1 - sstep(0.30, 0.42, p.y)) * sstep(0.2, 0.8, n.z)
    c = c.lerp(COAT_DARK, 0.55 * back)
    cream = 0.0
    # belly / underside of torso
    if -0.30 < p.y < 0.36:
        cream = max(cream, sstep(0.46, 0.40, p.z) * sstep(0.30, 0.42, p.z) * sstep(-0.1, -0.6, n.z) * 0.9)
    # chest bib and throat
    cream = max(cream, ell(p, (0, -0.34, 0.52), (0.13, 0.13, 0.19)) * sstep(0.1, -0.5, n.y))
    cream = max(cream, ell(p, (0, -0.40, 0.72), (0.07, 0.07, 0.07)) * 0.9)
    # cheeks and lower muzzle
    cream = max(cream, ell(p, (0, -0.47, 0.755), (0.07, 0.11, 0.03)) * 0.85)
    for s in (1, -1):
        cream = max(cream, blob(p, (s * 0.10, -0.38, 0.765), 0.06) * 0.6)
        # feathering behind hind legs, light socks
        cream = max(cream, ell(p, (s * 0.098, 0.37, 0.33), (0.07, 0.08, 0.17)) * sstep(0.0, 0.6, n.y) * 0.75)
        cream = max(cream, sstep(0.10, 0.02, p.z) * 0.45)
        # brows
        cream = max(cream, blob(p, (s * 0.045, -0.475, 0.862), 0.024) * 0.35)
    # tail: cream underside and tip
    if p.y > 0.42 and p.z > 0.52:
        cream = max(cream, sstep(0.1, -0.6, n.z) * 0.9)
        cream = max(cream, blob(p, (0, 0.79, 0.70), 0.13) * 0.95)
    c = c.lerp(CREAM, cream)
    # darker muzzle bridge and around the eyes
    dark = ell(p, (0, -0.50, 0.812), (0.035, 0.09, 0.03)) * 0.7
    c = c.lerp(MUZZLE_DARK, dark)
    # inside of mouth
    mouth = ell(p, (0, -0.50, 0.748), (0.032, 0.07, 0.016))
    c = c.lerp(srgb(0.35, 0.12, 0.13), mouth * 0.9)
    # ears: dark rims/back, lighter inner
    if p.z > 0.875 and abs(p.x) > 0.02:
        inner = sstep(0.2, -0.6, n.y)
        c = c.lerp(COAT_DARK, 0.5)
        c = c.lerp(EAR_IN.lerp(CREAM, 0.35), inner * 0.9)
        c = c.lerp(srgb(0.30, 0.18, 0.12), sstep(0.955, 1.0, p.z) * 0.8)
    col.data[v.index].color = (c.x, c.y, c.z, 1)

# ---------- small parts ----------
extras = []


def extra(obj, colour, bone, mat="fur"):
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    bpy.ops.object.shade_smooth()
    ca = obj.data.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for d in ca.data:
        d.color = (colour.x, colour.y, colour.z, 1)
    vg = obj.vertex_groups.new(name=bone)
    vg.add(range(len(obj.data.vertices)), 1.0, "REPLACE")
    obj["mat"] = mat
    extras.append(obj)
    return obj


def sph(p, r, scale=(1, 1, 1), rot=(0, 0, 0), sub=2):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=p)
    o = bpy.context.object
    o.scale = scale
    o.rotation_euler = rot
    return o


extra(sph((0, -0.607, 0.797), 0.024, (1.15, 0.8, 0.85)), NOSE, "head", "gloss")
for s in (1, -1):
    extra(sph((s * 0.049, -0.468, 0.834), 0.0195, (1, 0.7, 1)), srgb(0.10, 0.06, 0.04), "head", "gloss")
    extra(sph((s * 0.046, -0.4815, 0.841), 0.0052), WHITE, "head", "gloss")
# tongue
extra(sph((0, -0.528, 0.728), 1, (0.021, 0.052, 0.007), (math.radians(-24), 0, 0), 3), TONGUE, "head")
# collar + tag
bpy.ops.mesh.primitive_torus_add(major_radius=0.089, minor_radius=0.015, major_segments=24, minor_segments=8,
                                 location=(0, -0.312, 0.668), rotation=(math.radians(33), 0, 0))
o = bpy.context.object
o.scale = (1, 1, 1)
extra(o, COLLAR, "neck")
bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.019, depth=0.005, location=(0, -0.400, 0.598),
                                    rotation=(math.radians(90 + 12), 0, 0))
extra(bpy.context.object, TAG, "neck", "gloss")

# ---------- armature ----------
bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
arm = bpy.context.object
arm.name = "RalucaRig"
eb = arm.data.edit_bones
eb.remove(eb[0])


def bone(name, head, tail, parent=None, connect=False):
    b = eb.new(name)
    b.head, b.tail = head, tail
    if parent:
        b.parent = eb[parent]
        b.use_connect = connect
    return b


bone("root", (0, 0, 0), (0, 0.12, 0))
bone("hips", (0, 0.30, 0.51), (0, 0.05, 0.51), "root")
bone("spine", (0, 0.05, 0.51), (0, -0.21, 0.52), "hips", True)
bone("neck", (0, -0.22, 0.56), (0, -0.365, 0.76), "spine")
bone("head", (0, -0.365, 0.76), (0, -0.56, 0.79), "neck", True)
bone("tail1", (0, 0.37, 0.54), (0, 0.47, 0.63), "hips")
bone("tail2", (0, 0.47, 0.63), (0, 0.58, 0.70), "tail1", True)
bone("tail3", (0, 0.58, 0.70), (0, 0.765, 0.67), "tail2", True)
for s, sfx in ((1, ".L"), (-1, ".R")):
    bone("ear" + sfx, (s * 0.06, -0.36, 0.88), (s * 0.092, -0.355, 1.03), "head")
    bone("frontUpper" + sfx, (s * 0.083, -0.205, 0.47), (s * 0.085, -0.215, 0.29), "spine")
    bone("frontLower" + sfx, (s * 0.085, -0.215, 0.29), (s * 0.085, -0.215, 0.075), "frontUpper" + sfx, True)
    bone("frontPaw" + sfx, (s * 0.085, -0.215, 0.075), (s * 0.085, -0.275, 0.02), "frontLower" + sfx, True)
    bone("hindUpper" + sfx, (s * 0.09, 0.27, 0.47), (s * 0.098, 0.235, 0.29), "hips")
    bone("hindLower" + sfx, (s * 0.098, 0.235, 0.29), (s * 0.098, 0.36, 0.16), "hindUpper" + sfx, True)
    bone("hindFoot" + sfx, (s * 0.098, 0.36, 0.16), (s * 0.098, 0.345, 0.06), "hindLower" + sfx, True)
    bone("hindPaw" + sfx, (s * 0.098, 0.345, 0.06), (s * 0.098, 0.29, 0.02), "hindFoot" + sfx, True)
bpy.ops.object.mode_set(mode="OBJECT")
arm.data.bones["root"].use_deform = False

# skin body with automatic weights
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
print("groups:", len(body.vertex_groups))

# fix: head parts (ears, skull, muzzle) fully follow head/ears; smooth elsewhere
vg = {g.name: g for g in body.vertex_groups}
for v in body.data.vertices:
    p = v.co
    w = sstep(0.795, 0.83, p.z - 0.25 * (p.y + 0.40)) if p.y < -0.28 else 0.0  # head region
    if p.y < -0.44:
        w = 1.0
    if w > 0:
        ear = None
        if p.z > 0.875 and abs(p.x) > 0.02:
            ear = "ear.L" if p.x > 0 else "ear.R"
            ew = sstep(0.875, 0.92, p.z)
        cur = {g.group: g.weight for g in v.groups}
        for gi, gw in cur.items():
            body.vertex_groups[gi].add([v.index], gw * (1 - w), "REPLACE")
        if ear:
            vg[ear].add([v.index], w * ew, "REPLACE")
            vg["head"].add([v.index], w * (1 - ew), "REPLACE")
        else:
            vg["head"].add([v.index], w, "REPLACE")
            for e in ("ear.L", "ear.R"):
                vg[e].add([v.index], 0.0, "REPLACE")

# join extras
fur = bpy.data.materials.new("RalucaFur")
gloss = bpy.data.materials.new("RalucaGloss")
for mat, rough in ((fur, 0.85), (gloss, 0.25)):
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    attr = nt.nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    nt.links.new(attr.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = 0.0
body.data.materials.append(fur)
body.data.materials.append(gloss)
bpy.ops.object.select_all(action="DESELECT")
for o in extras:
    o.data.materials.append(fur)
    o.data.materials.append(gloss)
    idx = 1 if o["mat"] == "gloss" else 0
    for p in o.data.polygons:
        p.material_index = idx
    o.select_set(True)
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.join()
body.data.color_attributes.active_color = body.data.color_attributes["Col"]
body.data.color_attributes.render_color_index = 0
bpy.ops.object.select_all(action="DESELECT")
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.vertex_group_limit_total(limit=4)
bpy.ops.object.vertex_group_normalize_all(lock_active=False)
print("total tris:", sum(len(p.vertices) - 2 for p in body.data.polygons), "verts:", len(body.data.vertices))

# ---------- animations ----------
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode="POSE")
pb = arm.pose.bones
REST = {b.name: arm.data.bones[b.name].matrix_local.to_3x3() for b in pb}
for b in pb:
    b.rotation_mode = "QUATERNION"
arm.animation_data_create()
FPS = 30
D = math.radians


def key(name, f, ax=0.0, ay=0.0, az=0.0):
    """Rotate bone by armature-space angles (degrees): ax pitch (+ = swing back), ay roll, az yaw."""
    B = REST[name]
    R = Euler((D(ax), D(ay), D(az)), "XYZ").to_matrix()
    b = pb[name]
    b.rotation_quaternion = (B.inverted() @ R @ B).to_quaternion()
    b.keyframe_insert("rotation_quaternion", frame=f)


def keyloc(name, f, x=0.0, y=0.0, z=0.0):
    B = REST[name]
    b = pb[name]
    b.location = B.inverted() @ Vector((x, y, z))
    b.keyframe_insert("location", frame=f)


def reset():
    for b in pb:
        b.rotation_quaternion = (1, 0, 0, 0)
        b.location = (0, 0, 0)


actions = []


def make(name, frames, fn):
    reset()
    act = bpy.data.actions.new(name)
    arm.animation_data.action = act
    for f in range(frames + 1):
        fn(f, f / frames)
    actions.append((act, frames))
    arm.animation_data.action = None


def sides():
    return ((".L", 0.0), (".R", 0.5))


def leg_front(sfx, f, ph, amp, lift, base=0.0, lower_base=0.0):
    a = 2 * math.pi * ph
    swing = max(0.0, -math.cos(a))  # leg travelling forward, lifted
    key("frontUpper" + sfx, f, base + amp * math.sin(a) - lift * 0.35 * swing)
    key("frontLower" + sfx, f, lower_base + lift * swing)
    key("frontPaw" + sfx, f, lift * 0.6 * swing)


def leg_hind(sfx, f, ph, amp, lift, base=0.0):
    a = 2 * math.pi * ph
    swing = max(0.0, -math.cos(a))
    key("hindUpper" + sfx, f, base + amp * math.sin(a) - lift * 0.45 * swing)
    key("hindLower" + sfx, f, lift * 0.9 * swing)
    key("hindFoot" + sfx, f, -lift * 0.7 * swing)
    key("hindPaw" + sfx, f, lift * 0.5 * swing)


def idle(f, t):
    a = 2 * math.pi * t
    br = math.sin(2 * a)  # breathing, two breaths per loop
    keyloc("hips", f, z=0.004 * br)
    key("spine", f, ax=0.8 * br)
    key("neck", f, ax=-1.5 * br + 2 * math.sin(a), az=7 * math.sin(a))
    key("head", f, ay=6 * math.sin(a + 0.6), az=9 * math.sin(a), ax=2 * math.sin(2 * a + 1))
    wag = math.sin(6 * a)
    key("tail1", f, az=14 * wag, ax=3 * math.sin(a))
    key("tail2", f, az=16 * math.sin(6 * a - 0.7))
    key("tail3", f, az=18 * math.sin(6 * a - 1.4))
    flick = max(0.0, math.sin(a * 1 - 1.0)) ** 12
    key("ear.L", f, ax=-18 * flick, ay=4 * math.sin(a))
    key("ear.R", f, ax=-14 * max(0.0, math.sin(a - 2.6)) ** 12, ay=-4 * math.sin(a))
    for sfx, _ in sides():
        key("frontUpper" + sfx, f, ax=-0.8 * br)


def walk(f, t):
    a = 2 * math.pi * t
    for sfx, off in sides():
        leg_front(sfx, f, t + off, 24, 34)
        leg_hind(sfx, f, t + off + 0.5 + 0.08, 22, 34)
    keyloc("hips", f, z=0.008 * math.sin(2 * a) - 0.006)
    key("hips", f, ay=2.5 * math.sin(a), az=3 * math.sin(a))
    key("spine", f, az=-5 * math.sin(a), ax=1.2 * math.sin(2 * a))
    key("neck", f, ax=3 * math.sin(2 * a + 0.5), az=2 * math.sin(a))
    key("head", f, ax=-3 * math.sin(2 * a + 0.5))
    key("tail1", f, az=12 * math.sin(a), ax=4 * math.sin(2 * a))
    key("tail2", f, az=14 * math.sin(a - 0.6))
    key("tail3", f, az=16 * math.sin(a - 1.2))
    key("ear.L", f, ax=-3 * math.sin(2 * a))
    key("ear.R", f, ax=-3 * math.sin(2 * a))


def run(f, t):
    a = 2 * math.pi * t
    for sfx, off in ((".L", 0.0), (".R", 0.12)):
        leg_front(sfx, f, t + off, 42, 60, base=-6)
        leg_hind(sfx, f, t + off + 0.45, 40, 55, base=4)
    keyloc("hips", f, z=0.035 * math.sin(a + 0.8) + 0.005)
    key("hips", f, ax=5 * math.sin(a + 0.3))
    key("spine", f, ax=-9 * math.sin(a + 0.3))
    key("neck", f, ax=10 + 5 * math.sin(a + 1.2))
    key("head", f, ax=-6 - 5 * math.sin(a + 1.2))
    key("tail1", f, ax=-24 + 8 * math.sin(a + 2))
    key("tail2", f, ax=-10 + 8 * math.sin(a + 1.4))
    key("tail3", f, ax=-4 + 8 * math.sin(a + 0.8))
    key("ear.L", f, ax=-20 - 8 * math.sin(a), ay=6)
    key("ear.R", f, ax=-20 - 8 * math.sin(a), ay=-6)


SIT = dict(pitch=-36, drop=0.30)


def sit(f, t):
    a = 2 * math.pi * t
    br = math.sin(2 * a)
    p = SIT["pitch"]
    keyloc("hips", f, z=-SIT["drop"] + 0.003 * br)
    key("hips", f, ax=p)
    key("spine", f, ax=0.8 * br)
    key("neck", f, ax=22 + 2 * math.sin(a), az=5 * math.sin(a))
    key("head", f, ax=14, ay=7 * math.sin(a + 0.5), az=7 * math.sin(a))
    for sfx, _ in sides():
        sgn = 1 if sfx == ".L" else -1
        key("frontUpper" + sfx, f, ax=-p - 0.8 * br)
        key("frontLower" + sfx, f, ax=0)
        key("frontPaw" + sfx, f, ax=0)
        key("hindUpper" + sfx, f, ax=-89 - p, ay=-10 * sgn)
        key("hindLower" + sfx, f, ax=78.5)
        key("hindFoot" + sfx, f, ax=-61)
        key("hindPaw" + sfx, f, ax=40)
    key("tail1", f, ax=-16, az=24 * math.sin(4 * a))
    key("tail2", f, ax=8, az=22 * math.sin(4 * a - 0.7))
    key("tail3", f, ax=12, az=22 * math.sin(4 * a - 1.4))
    key("ear.L", f, ay=4 * math.sin(a))
    key("ear.R", f, ay=-4 * math.sin(a))


make("Survey", 120, idle)   # same clip names as the fox so the game code keeps working
make("Walk", 24, walk)
make("Run", 13, run)
make("Sit", 90, sit)
reset()
bpy.ops.object.mode_set(mode="OBJECT")

for act, frames in actions:
    tr = arm.animation_data.nla_tracks.new()
    tr.name = act.name
    st = tr.strips.new(act.name, 0, act)
    st.name = act.name
    st.action_frame_start, st.action_frame_end = 0, frames

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT, export_format="GLB", use_selection=True,
    export_animations=True, export_animation_mode="NLA_TRACKS",
    export_force_sampling=True, export_frame_range=False,
    export_vertex_color="ACTIVE", export_all_vertex_colors=False,
    export_yup=True, export_skins=True, export_def_bones=False,
    export_optimize_animation_size=True, export_anim_slide_to_zero=True,
)
print("exported", OUT)
