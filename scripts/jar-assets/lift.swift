import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

// On-device subject mask (Apple Vision, macOS 14+), used by build.mjs.
// Usage: lift <in.png> <out-mask.png>  — writes the soft foreground mask
// (8-bit grayscale) at the source resolution. Nothing leaves the machine.
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1]); let outURL = URL(fileURLWithPath: args[2])
guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("read") }
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([req])
guard let obs = req.results?.first else { fatalError("no subject") }
let buf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
let gray = CGColorSpaceCreateDeviceGray()
guard let out = ctx.createCGImage(ci, from: ci.extent, format: .L8, colorSpace: gray) else { fatalError("cg") }
let dest = CGImageDestinationCreateWithURL(outURL as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, out, nil); CGImageDestinationFinalize(dest)
