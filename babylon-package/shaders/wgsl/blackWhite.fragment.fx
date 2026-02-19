// Samplers
varying vUV: vec2f;
var textureSamplerSampler: sampler;
var textureSampler: texture_2d<f32>;

@fragment
fn main(input: FragmentInputs) -> FragmentOutputs {
	var color: vec3f = textureSample(textureSampler, textureSamplerSampler, fragmentInputs.vUV).rgb;
	var luminance: f32 = dot(color,  vec3f(0.3, 0.59, 0.11));    
	var blackAndWhite: vec3f =  vec3f(luminance, luminance, luminance);
	fragmentOutputs.color =  vec4f(color - ((color - blackAndWhite)), 1.0);
}